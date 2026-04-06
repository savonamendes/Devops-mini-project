"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Video,
  Users,
  Mic,
  MicOff,
  VideoOff,
  AlertCircle,
  PhoneOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

// Constants for better maintainability
const JITSI_SERVER = process.env.NEXT_PUBLIC_JITSI_SERVER || "meet.jit.si";
const ROOM_PREFIX = "odrlab-";

// Types for better type safety
interface IJitsiMeetAPI {
  executeCommand: (command: string, ...args: unknown[]) => void;
  addListener: (event: string, listener: (data: unknown) => void) => void;
  removeListener: (event: string, listener: (data: unknown) => void) => void;
  addEventListener: (event: string, fn: () => void) => void;
  removeEventListener: (event: string, fn: () => void) => void;
  dispose: () => void;
  getNumberOfParticipants: () => number;
}

interface JitsiParticipant {
  id: string;
  displayName?: string;
}

// Dynamically import JitsiMeeting to avoid SSR issues
const JitsiMeeting = dynamic(
  () => import("@jitsi/react-sdk").then((mod) => mod.JitsiMeeting),
  { ssr: false }
);

interface JitsiMeetContainerProps {
  roomName: string;
  userName: string;
  userEmail?: string;
  meetingId?: string; // Optional meeting ID for tracking specific meetings
}

export function JitsiMeetContainer({
  roomName,
  userName,
  userEmail,
  meetingId,
}: JitsiMeetContainerProps) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [participantCount, setParticipantCount] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [jitsiApi, setJitsiApi] = useState<IJitsiMeetAPI | null>(null);
  const apiRef = useRef<IJitsiMeetAPI | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupEventListeners = useRef<(() => void) | null>(null);

  // Use a sanitized version of the roomName to avoid issues with special characters
  const sanitizedRoomName = roomName.replace(/\s+/g, "-").toLowerCase();

  // Safely post data to API with error handling
  const safeAPICall = useCallback(
    async (
      endpoint: string,
      data: Record<string, unknown>
    ) => {
      try {
        if (!user) return;

        // Include meetingId in API calls if available
        const apiData = {
          ...data,
          ...(meetingId && { meetingId }),
        };

        const response = await apiFetch(`/meetings/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify(apiData),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        console.error(`Failed with API endpoint ${endpoint}:`, err);
        // Don't set UI error for backend issues that don't affect the user experience
      }
    },
    [user, meetingId] // Only recreate when user or meetingId changes
  );

  // Component lifecycle management
  useEffect(() => {
    setMounted(true);

    // Cleanup function: record meeting end when component unmounts
    return () => {
      // Clear any pending retry attempts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      // Remove any event listeners
      if (cleanupEventListeners.current) {
        cleanupEventListeners.current();
      }

      // Update meeting status when component unmounts
      if (apiRef.current) {
        safeAPICall("update-status", {
          roomName: sanitizedRoomName,
          status: "COMPLETED",
          endTime: new Date().toISOString(),
        });

        // Dispose of the Jitsi API to clean up resources
        try {
          apiRef.current.dispose();
        } catch (err) {
          console.warn("Error disposing Jitsi API:", err);
        }
      }
    };
  }, [roomName, sanitizedRoomName, safeAPICall]); // Now safeAPICall is properly memoized

  const handleJitsiIFrameRef = (parentNode: HTMLDivElement) => {
    if (!parentNode) return;

    // Responsive height based on screen size
    const setResponsiveHeight = () => {
      // More dynamic height calculation based on available space
      const viewportHeight = window.innerHeight;
      const elementPosition = parentNode.getBoundingClientRect().top;
      const availableHeight = viewportHeight - elementPosition - 50; // 50px buffer

      // Set minimum and maximum heights
      const height = Math.max(
        Math.min(availableHeight, 600), // Max height 600px
        300 // Min height 300px
      );

      parentNode.style.height = `${height}px`;
      parentNode.style.width = "100%";
    };

    // Set initial height
    setResponsiveHeight();

    // Add resize listener
    window.addEventListener("resize", setResponsiveHeight);

    // Return cleanup function
    return () => {
      window.removeEventListener("resize", setResponsiveHeight);
    };
  };

  const handleApiReady = (api: IJitsiMeetAPI) => {
    // Store API references
    setJitsiApi(api);
    apiRef.current = api;
    setConnectionAttempts(0); // Reset connection attempts on successful connection
    setError(null);

    // Set up event listeners with proper cleanup
    const eventListeners: Array<{
      event: string;
      listener: (data: unknown) => void;
    }> = [];

    const addListener = (event: string, listener: (data: unknown) => void) => {
      api.addListener(event, listener);
      eventListeners.push({ event, listener });
    };

    // Participant joined event
    addListener("participantJoined", (data: unknown) => {
      const participant = data as JitsiParticipant;
      const count = api.getNumberOfParticipants();
      setParticipantCount(count);

      // Record participant joined in database
      safeAPICall("participant-joined", {
        roomName: sanitizedRoomName,
        participantId: participant.id,
        displayName: participant.displayName,
        joinTime: new Date().toISOString(),
      });
    });

    // Participant left event
    addListener("participantLeft", (data: unknown) => {
      const participant = data as JitsiParticipant;
      const count = api.getNumberOfParticipants();
      setParticipantCount(count);

      // Record participant left in database
      safeAPICall("participant-left", {
        roomName: sanitizedRoomName,
        participantId: participant.id,
        leaveTime: new Date().toISOString(),
      });
    });

    // Audio mute status changed
    addListener("audioMuteStatusChanged", (data: unknown) => {
      const muteData = data as { muted: boolean };
      setIsMuted(muteData.muted);
    });

    // Video mute status changed
    addListener("videoMuteStatusChanged", (data: unknown) => {
      const muteData = data as { muted: boolean };
      setIsVideoOff(muteData.muted);
    });

    // Connection quality concerns
    addListener("connectionEstablished", () => {
      console.log("Jitsi connection established");
    });

    addListener("connectionFailed", () => {
      setError(
        "Connection to meeting server failed. Please check your internet connection."
      );
      retryConnection();
    });

    // Set up cleanup function for all event listeners
    cleanupEventListeners.current = () => {
      eventListeners.forEach(({ event, listener }) => {
        try {
          api.removeListener(event, listener);
        } catch (err) {
          console.warn(`Error removing listener for ${event}:`, err);
        }
      });
    };

    // Record meeting start in database
    safeAPICall("update-status", {
      roomName: roomName,
      status: "IN_PROGRESS",
      startTime: new Date().toISOString(),
    });
  };

  const retryConnection = () => {
    const maxRetries = 3;

    if (connectionAttempts < maxRetries) {
      setConnectionAttempts((prev) => prev + 1);

      // Exponential backoff: 2, 4, 8 seconds
      const delay = Math.pow(2, connectionAttempts + 1) * 1000;

      retryTimeoutRef.current = setTimeout(() => {
        setMounted(false);
        setTimeout(() => setMounted(true), 100);
      }, delay);
    } else {
      setError(
        "Unable to connect to the meeting room after multiple attempts. Please try refreshing the page."
      );
    }
  };

  const toggleAudio = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleAudio");
    }
  };

  const toggleVideo = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand("toggleVideo");
    }
  };

  const endMeeting = async () => {
    if (
      window.confirm(
        "Are you sure you want to end the meeting for all participants?"
      )
    ) {
      try {
        // Record meeting end in database
        await safeAPICall("end-meeting", {
          roomName: sanitizedRoomName,
          endTime: new Date().toISOString(),
        });

        // Clean up Jitsi API
        if (jitsiApi) {
          jitsiApi.executeCommand("hangup");
          jitsiApi.dispose();
        }

        // Redirect to the idea workplace page
        window.location.href = window.location.href.split("/meetings/")[0];
      } catch (err) {
        console.error("Failed to end meeting:", err);
        alert("Failed to end the meeting. Please try again.");
      }
    }
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="aspect-video w-full rounded-lg border bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Video className="h-6 w-6 text-blue-500 animate-pulse" />
          </div>
          <div className="text-gray-500 text-sm">
            Initializing meeting room
            {connectionAttempts > 0
              ? ` (Attempt ${connectionAttempts + 1})`
              : ""}
            ...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="aspect-video w-full rounded-lg border bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <div className="text-red-500 font-medium mb-2">
              Meeting Connection Error
            </div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setConnectionAttempts(0);
                setMounted(false);
                setTimeout(() => setMounted(true), 100);
              }}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full Jitsi Meeting UI
  return (
    <div className="rounded-lg overflow-hidden border shadow-sm">
      <div className="bg-[#0a1e42] text-white px-2 sm:px-4 py-1 sm:py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 sm:gap-0">
        <div className="flex items-center flex-wrap gap-1">
          <div className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
            Meeting: {roomName}
          </div>
          <div className="text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center">
            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />{" "}
            {participantCount}
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            className={`p-1 sm:p-1.5 rounded-full ${
              isMuted ? "bg-red-500" : "bg-green-500"
            }`}
            onClick={toggleAudio}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}>
            {isMuted ? (
              <MicOff className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            ) : (
              <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            )}
          </button>
          <button
            className={`p-1 sm:p-1.5 rounded-full ${
              isVideoOff ? "bg-red-500" : "bg-green-500"
            }`}
            onClick={toggleVideo}
            aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}>
            {isVideoOff ? (
              <VideoOff className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            ) : (
              <Video className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            )}
          </button>
          <button
            className="p-1 sm:p-1.5 rounded bg-red-600 hover:bg-red-700 text-[10px] sm:text-xs text-white flex items-center gap-1"
            onClick={endMeeting}
            aria-label="End meeting">
            <PhoneOff className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">End Meeting</span>
          </button>
          <div className="text-[10px] sm:text-xs bg-green-500/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            Live
          </div>
        </div>
      </div>
      <JitsiMeeting
        domain={JITSI_SERVER}
        roomName={`${ROOM_PREFIX}${sanitizedRoomName}`}
        configOverwrite={{
          // Core functionality
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          prejoinPageEnabled: true,
          disableModeratorIndicator: true,
          enableNoisyMicDetection: true,
          enableClosePage: false,
          disableDeepLinking: true,

          // Security settings
          startAudioOnly: false,
          startScreenSharing: false,
          enableWelcomePage: false,

          // Production optimizations
          disableAudioLevels: true, // Improves performance
          resolution: 720, // Recommended for production
          constraints: {
            video: {
              height: {
                ideal: 720,
                max: 720,
                min: 240,
              },
            },
          },

          // Connection optimizations
          p2p: {
            enabled: true,
            preferH264: true,
            disableH264: false,
            stunServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
            ],
          },

          // UI configuration
          toolbarButtons: [
            "microphone",
            "camera",
            "desktop",
            "fullscreen",
            "chat",
            "raisehand",
            "tileview",
            "settings",
            "videoquality",
            "filmstrip",
            "invite",
            "stats",
          ],

          // Branding
          hiddenDomain: "meet.jitsi",

          // Performance
          enableLayerSuspension: true, // Saves bandwidth
          disableSimulcast: false,
        }}
        interfaceConfigOverwrite={{
          // Branding
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          DEFAULT_BACKGROUND: "#040720",
          DEFAULT_REMOTE_DISPLAY_NAME: "Participant",

          // UI elements
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "chat",
            "raisehand",
            "tileview",
            "settings",
            "videoquality",
            "filmstrip",
            "invite",
            "shortcuts",
            "mute-everyone",
          ],
          TOOLBAR_ALWAYS_VISIBLE: false,

          // Notifications
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          DISABLE_VIDEO_BACKGROUND: true,

          // Mobile optimizations
          MOBILE_APP_PROMO: false,
        }}
        userInfo={{
          displayName: userName || "Participant",
          email: userEmail || "user@example.com",
        }}
        onApiReady={handleApiReady}
        getIFrameRef={handleJitsiIFrameRef}
      />
    </div>
  );
}
