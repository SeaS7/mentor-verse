"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { FiRefreshCw } from "react-icons/fi"; // Import Refresh Icon

interface SessionLink {
  _id: string;
  sessionLink: string;
  date: string;
  time: string;
}

export default function SessionCard({
  studentId,
  mentorId,
  isMentor,
}: {
  studentId: string;
  mentorId: string;
  isMentor: boolean;
}) {
  const [sessionLinks, setSessionLinks] = useState<SessionLink[]>([]);
  const [newLink, setNewLink] = useState("");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchSessions = async () => {
    setLoading(true);
    try {
      if (isMentor) {
        const { data } = await axios.get(`/api/session`, {
          params: { studentId: mentorId, mentorId: studentId },
        });
        if (data.success) {
          setSessionLinks(data.sessions);
        }
      } else {
        const { data } = await axios.get(`/api/session`, {
          params: { studentId, mentorId },
        });
        if (data.success) {
          setSessionLinks(data.sessions);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [mentorId, studentId]);

  // ✅ Add Session
  const addSession = async () => {
    if (!newLink.trim() || !newDate) {
      toast({
        title: "Error",
        description: "Please enter a valid link and date.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = await axios.post("/api/session", {
        mentorId: studentId,
        studentId: mentorId,
        date: newDate,
        time: format(new Date(newDate), "HH:mm"),
        sessionLink: newLink,
      });

      if (data.success) {
        setSessionLinks([...sessionLinks, data.session]);
        setNewLink("");
        setNewDate("");
      }
    } catch (error) {
      console.error("❌ Error creating session:", error);
    }
  };

  // ✅ Delete Session
  const deleteSession = async (id: string) => {
    try {
      await axios.delete(`/api/session`, { data: { sessionId: id } });

      setSessionLinks(sessionLinks.filter((session) => session._id !== id));
      toast({
        title: "Session Deleted",
        description: "Session removed successfully!",
      });
    } catch (error) {
      console.error("❌ Error deleting session:", error);
      toast({
        title: "Error",
        description: "Failed to delete session.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sessions</h2>

        {/* ✅ Refresh Button */}
        <button
          onClick={fetchSessions}
          className={`p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          <FiRefreshCw
            className={`text-gray-800 dark:text-white ${loading ? "animate-spin" : ""}`}
            size={20}
          />
        </button>
      </div>

      {/* ✅ List of Sessions */}
      <div className="space-y-2 overflow-y-auto max-h-[70vh]">
        {sessionLinks.length > 0 ? (
          sessionLinks.map((link) => (
            <div
              key={link._id}
              className="p-3 rounded-lg flex justify-between items-center bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
            >
              <span className="block text-xs text-gray-700 dark:text-gray-300">
                {format(new Date(link.date), "PPPP")} at {link.time}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(link.sessionLink, "_blank")}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  Open
                </button>
                {isMentor && (
                  <button
                    onClick={() => deleteSession(link._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No sessions added.</p>
        )}
      </div>

      {/* ✅ Add New Session (Only for Mentors) */}
      {isMentor && (
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Paste session link..."
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
          />
          <input
            type="datetime-local"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
          />
          <button
            onClick={addSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2"
          >
            Add Session
          </button>
        </div>
      )}
    </div>
  );
}
