"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { FileText, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { apiFetch } from "@/lib/api";

interface MeetingNotesProps {
  meetingId: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
  lastEditedBy?: {
    id: string;
    name: string;
  };
}

export function MeetingNotes({ meetingId }: MeetingNotesProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  // Memoize fetchNotes to avoid unnecessary re-renders and race conditions
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/meetings/${meetingId}/notes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  // Fetch notes for the meeting
  useEffect(() => {
    if (meetingId) {
      fetchNotes();
    }
  }, [meetingId, fetchNotes]); // fetchNotes is now memoized and included

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      return;
    }

    try {
      const response = await apiFetch(`/meetings/${meetingId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNoteContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      // Clear input and refresh notes
      setNewNoteContent("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
      setError("Failed to add note. Please try again.");
    }
  };

  const formatNoteDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Meeting Notes</h2>
      </div>

      {error && (
        <div className="bg-red-100 p-2 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {loading ? (
          <div className="text-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-[#0a1e42] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed">
            <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <h3 className="text-gray-600 font-medium mb-1">No notes yet</h3>
            <p className="text-gray-500 text-sm">
              Add your first note to capture important information.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 border rounded-lg bg-white shadow-sm">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-[#0a1e42] text-white flex items-center justify-center text-sm font-medium">
                  {note.author.name.charAt(0)}
                </div>
                <div className="ml-2">
                  <div className="font-medium text-sm">{note.author.name}</div>
                  <div className="text-xs text-gray-500">
                    {formatNoteDate(note.createdAt)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {note.content}
              </div>
              {note.lastEditedBy && note.updatedAt !== note.createdAt && (
                <div className="text-xs text-gray-500 mt-2 italic">
                  Edited {formatNoteDate(note.updatedAt)} by{" "}
                  {note.lastEditedBy.name}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="border-t pt-4 mt-auto">
        <div className="flex items-start">
          <Textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Add a note..."
            className="min-h-[80px] flex-grow mr-2"
          />
          <Button
            onClick={handleAddNote}
            disabled={!newNoteContent.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
