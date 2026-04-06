"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Video,
  StickyNote,
  Maximize,
  Minimize,
  Settings,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { JitsiMeetContainer } from "@/components/workplace/JitsiMeetContainer";
import TeamDetails from "../TeamDetails";

export default function WorkplacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ideaId = params?.ideaId as string;
  const [fullscreenMode, setFullscreenMode] = useState("");
  const [ideaDetails, setIdeaDetails] = useState<{
    name: string;
    description: string;
    ownerId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch idea details and check access permissions
  useEffect(() => {
    if (loading) return;

    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Fetch idea details from API
    setIsLoading(true);
    setError(null);

    apiFetch(`/ideas/${ideaId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error(
              "You don't have permission to access this workspace"
            );
          } else if (res.status === 404) {
            throw new Error("Idea not found");
          }
          throw new Error("Failed to fetch idea details");
        }
        return res.json();
      })
      .then((data) => {
        setIdeaDetails(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch idea details:", error);
        setError(error.message || "Failed to load workspace");
        setIsLoading(false);
      });
  }, [user, loading, router, ideaId]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#0a1e42]">
            Loading Workplace
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your workspace...
          </p>
        </div>
      </div>
    );
  }

  // Handle authentication redirect (middleware should handle this but adding as backup)
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="rounded-lg border p-8 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-[#0a1e42]">
            Authentication Required
          </h2>
          <p className="mb-4 text-gray-600">
            Please sign in to access the workplace.
          </p>
          <Button
            onClick={() =>
              router.push(`/signin?redirect=/discussion/${ideaId}/workplace`)
            }>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Handle errors
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#0a1e42]">Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/discussion/${ideaId}`)}>
              Back to Discussion
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const toggleFullscreen = (section: string) => {
    setFullscreenMode(fullscreenMode === section ? "" : section);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 py-4 text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href={`/discussion/${ideaId}`}
              className="mr-4 hover:text-blue-200 flex items-center transition-all duration-300 rounded-md px-2 py-1 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discussion
            </Link>
            <h1 className="text-xl font-bold hidden md:block">
              {ideaDetails?.name || "Idea Workplace"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Welcome, {user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white/20 hover:text-white transition-all duration-300">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {fullscreenMode ? (
        <div className="flex-1 p-4 flex flex-col">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleFullscreen("")}
            className="self-end mb-2 bg-white/80 hover:bg-white transition-all duration-300">
            <Minimize className="h-4 w-4 mr-2" /> Exit Fullscreen
          </Button>

          {fullscreenMode === "meeting" && (
            <div className="flex-1 rounded-xl overflow-hidden shadow-lg border border-blue-100">
              <JitsiMeetContainer
                roomName={`idea-${ideaId}`}
                userName={user.name}
                userEmail={user.email}
              />
            </div>
          )}

          {fullscreenMode === "meetingnotes" && (
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-lg p-6 h-full border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                  <StickyNote className="h-5 w-5 mr-2" />
                  Meeting Notes
                </h3>
                <div className="flex flex-col justify-center items-center h-[calc(100%-50px)]">
                  <StickyNote className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                  <h4 className="text-xl font-medium mb-2 text-gray-700">
                    Meeting-Specific Notes
                  </h4>
                  <p className="text-gray-500 mb-4 text-center max-w-lg">
                    Notes are now organized per meeting. Please select a
                    specific meeting from the Meeting Logs section to view and
                    add notes related to that meeting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {fullscreenMode === "teamdetails" && (
            <div className="flex-1">
              <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-lg p-6 h-full">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  Team Details
                </h3>
                <TeamDetails ideaId={ideaId} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6 bg-white/60 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              {ideaDetails?.name || "Idea Workplace"}
            </h2>
            {ideaDetails?.description && (
              <p className="text-gray-600">{ideaDetails.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-blue-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                    <Video className="h-5 w-5 mr-2 text-blue-700" />
                    Video Meeting
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-50 transition-colors duration-300"
                    onClick={() => toggleFullscreen("meeting")}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden border border-blue-100">
                  <JitsiMeetContainer
                    roomName={`idea-${ideaId}`}
                    userName={user.name}
                    userEmail={user.email}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 h-[500px] border border-blue-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                    <StickyNote className="h-5 w-5 mr-2 text-blue-700" />
                    Meeting Notes
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm" 
                    className="hover:bg-blue-50 transition-colors duration-300"
                    onClick={() => toggleFullscreen("meetingnotes")}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[calc(100%-40px)] flex flex-col justify-center items-center">
                  <div className="p-4 text-center">
                    <StickyNote className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                    <h4 className="text-lg font-medium mb-2 text-gray-700">
                      Meeting-Specific Notes
                    </h4>
                    <p className="text-gray-500 mb-2">
                      Notes are now connected to specific meetings for better
                      organization
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-blue-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Team Details
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-50 transition-colors duration-300"
                    onClick={() => toggleFullscreen("teamdetails")}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
                <TeamDetails ideaId={ideaId} />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
