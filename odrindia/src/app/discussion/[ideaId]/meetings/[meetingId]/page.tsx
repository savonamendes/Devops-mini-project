"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Users,
  Clipboard,
  Video,
  Play,
  CheckCircle2,
  XCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { JitsiMeetContainer } from "@/components/workplace/JitsiMeetContainer";
import { MeetingNotes } from "@/components/workplace/MeetingNotes";
import { apiFetch } from "@/lib/api";

interface Participant {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  joinTime?: string;
  leaveTime?: string;
  isPresenter: boolean;
}

interface MeetingNote {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  status: string;
  jitsiRoomName: string;
  summary?: string;
  createdAt: string;
  idea: {
    id: string;
    title: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  participants: Participant[];
  notes: MeetingNote[];
}

export default function MeetingDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const meetingId = params?.meetingId as string;
  const ideaId = params?.ideaId as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("meeting");
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  // Memoize fetchMeetingDetails function to avoid race conditions
  const fetchMeetingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/meetings/${meetingId}`, {
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/signin");
          return;
        }

        if (response.status === 404) {
          setError("Meeting not found");
          return;
        }

        throw new Error("Failed to fetch meeting");
      }

      const data = await response.json();
      setMeeting(data);
    } catch (err) {
      console.error("Error fetching meeting details:", err);
      setError("Failed to load meeting details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [meetingId, router]); // Add relevant dependencies

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }

    fetchMeetingDetails();
  }, [meetingId, user, router, fetchMeetingDetails]); // Now including fetchMeetingDetails

  useEffect(() => {
    if (meeting?.summary) {
      setSummaryText(meeting.summary);
    }
  }, [meeting]);

  const handleUpdateSummary = async () => {
    try {
      const response = await apiFetch(`/meetings/${meetingId}/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          summary: summaryText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update summary");
      }

      // Update the local meeting state with the new summary
      setMeeting((meeting) =>
        meeting ? { ...meeting, summary: summaryText } : null
      );

      // Close the dialog
      setIsEditingSummary(false);
    } catch (err) {
      console.error("Error updating summary:", err);
      setError("Failed to update summary. Please try again.");
    }
  };

  const updateMeetingStatus = async (status: string) => {
    try {
      const response = await apiFetch(`/meetings/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          roomName: meeting?.jitsiRoomName,
          status: status,
          endTime:
            status === "COMPLETED" ? new Date().toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update meeting status");
      }

      // Refresh meeting details
      fetchMeetingDetails();
    } catch (err) {
      console.error("Error updating meeting status:", err);
      setError("Failed to update meeting status");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMeetingStatusBadgeClass = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return null; // Auth redirect is handled in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-2 border-[#0a1e42] border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-lg w-full text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Meeting not found"}</p>
          <Link href={`/discussion/${ideaId}/workplace`}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="bg-[#0a1e42] py-4 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link
              href={`/discussion/${ideaId}/workplace`}
              className="mr-4 hover:text-gray-200 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workplace
            </Link>
            <h1 className="text-xl font-bold">Meeting: {meeting.title}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0a1e42]">
                {meeting.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getMeetingStatusBadgeClass(
                    meeting.status
                  )}`}>
                  {meeting.status.replace("_", " ")}
                </span>
                <span className="text-sm flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(meeting.startTime)}
                </span>
                <span className="text-sm flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  {meeting.participants.length} participant
                  {meeting.participants.length !== 1 ? "s" : ""}
                </span>
                <span className="text-sm flex items-center text-gray-600">
                  <Clipboard className="h-4 w-4 mr-1" />
                  {meeting.notes.length} note
                  {meeting.notes.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {meeting.status === "SCHEDULED" && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateMeetingStatus("IN_PROGRESS")}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Meeting
                </Button>
              )}
              {meeting.status === "IN_PROGRESS" && (
                <Button
                  onClick={() => updateMeetingStatus("COMPLETED")}
                  variant="outline">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  End Meeting
                </Button>
              )}
              {meeting.status === "SCHEDULED" && (
                <Button
                  onClick={() => updateMeetingStatus("CANCELLED")}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4">
          <TabsList className="bg-white">
            <TabsTrigger
              value="meeting"
              className="flex items-center gap-1">
              <Video className="h-4 w-4" /> Meeting Room
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex items-center gap-1">
              <Clipboard className="h-4 w-4" /> Notes
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              className="flex items-center gap-1">
              <Users className="h-4 w-4" /> Participants
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="meeting"
            className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-[#0a1e42] mb-4">
                Meeting Room
              </h3>
              {meeting.status === "CANCELLED" ? (
                <div className="bg-gray-50 border border-dashed rounded-lg p-8 text-center">
                  <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    This meeting has been cancelled
                  </h3>
                  <p className="text-gray-600">
                    The meeting room is not available for cancelled meetings.
                  </p>
                </div>
              ) : meeting.status === "COMPLETED" ? (
                <div className="bg-gray-50 border border-dashed rounded-lg p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    This meeting has ended
                  </h3>
                  <p className="text-gray-600 mb-4">
                    The meeting room is no longer active.
                  </p>
                  {meeting.summary ? (
                    <div className="bg-white border rounded-lg p-4 text-left mt-6">
                      <h4 className="text-sm font-medium mb-2">
                        Meeting Summary
                      </h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {meeting.summary}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs mt-2"
                        onClick={() => setIsEditingSummary(true)}>
                        Edit Summary
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingSummary(true)}>
                        Add Meeting Summary
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <JitsiMeetContainer
                  roomName={meeting.jitsiRoomName}
                  userName={user.name}
                  userEmail={user.email}
                  meetingId={meeting.id}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="notes"
            className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 h-[600px]">
              <MeetingNotes meetingId={meeting.id} />
            </div>
          </TabsContent>

          <TabsContent
            value="participants"
            className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-[#0a1e42] mb-4">
                Participants ({meeting.participants.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leave Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {meeting.participants.map((participant) => (
                      <tr key={participant.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {participant.user.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {participant.user.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {participant.isPresenter ? (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Presenter
                            </span>
                          ) : (
                            <span>Participant</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {participant.joinTime
                            ? formatDate(participant.joinTime)
                            : "Not joined yet"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {participant.leaveTime
                            ? formatDate(participant.leaveTime)
                            : "Still active"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Summary Dialog */}
      <Dialog
        open={isEditingSummary}
        onOpenChange={setIsEditingSummary}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {meeting?.summary
                ? "Edit Meeting Summary"
                : "Add Meeting Summary"}
            </DialogTitle>
          </DialogHeader>

          <Textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            placeholder="Enter a summary of what was discussed in this meeting..."
            className="min-h-[200px]"
          />

          {error && (
            <div className="bg-red-100 p-2 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingSummary(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSummary}
              disabled={!summaryText.trim()}>
              <Save className="h-4 w-4 mr-2" /> Save Summary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
