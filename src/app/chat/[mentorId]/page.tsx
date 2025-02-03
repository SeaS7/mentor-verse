"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";


interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  seen: boolean;
  createdAt?: any;
}

interface SessionLink {
  _id: string;
  sessionLink: string;
  date: string;
  time: string;
}

export default function Chat() {
  const { data: session } = useSession();
  const { mentorId } = useParams() as { mentorId: string };
  const studentId = session?.user?._id;
  const isMentor = session?.user?.role === "mentor";
  const chatId = isMentor
    ? `${mentorId}-${studentId}`
    : `${studentId}-${mentorId}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionLinks, setSessionLinks] = useState<SessionLink[]>([]);
  const [newLink, setNewLink] = useState("");
  const [newDate, setNewDate] = useState("");
  const { resolvedTheme, setTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!resolvedTheme) {
      setTheme("dark");
    }
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    if (!studentId || !mentorId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Message
      );

      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [studentId, mentorId]);

  const fetchSessions = async () => {
    if (session?.user?.role === "mentor") {
      try {
        const { data } = await axios.get(`/api/session`, {
          params: { studentId: mentorId, mentorId: studentId },
        });

        if (data.success) {
          setSessionLinks(data.sessions);
        }
      } catch (error) {
        console.error("❌ Error fetching sessions:", error);
      }
    } else {
      try {
        const { data } = await axios.get(`/api/session`, {
          params: { studentId, mentorId },
        });

        if (data.success) {
          setSessionLinks(data.sessions);
        }
      } catch (error) {
        console.error("❌ Error fetching sessions:", error);
      }
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [mentorId, studentId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !mentorId || !newMessage.trim()) return;
    setLoading(true);

    const messageData: Partial<Message> = {
      senderId: studentId,
      receiverId: mentorId,
      message: newMessage,
      seen: false,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "chats", chatId, "messages"), messageData);

    setNewMessage("");
    setLoading(false);
  };

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

  if (!mounted) return null;

  return (
    <div
      className={`flex items-center justify-center h-screen w-full pb-10 ${
        resolvedTheme === "dark"
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="grid grid-cols-2 gap-6 w-full max-w-6xl h-[90vh]">
        <div
          className={`rounded-lg shadow-lg p-6 ${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sessions</h2>
            <button
              onClick={() => fetchSessions()}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              🔄
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[70vh]">
            {sessionLinks.length > 0 ? (
              sessionLinks.map((link) => (
                <div
                  key={link._id}
                  className={`p-3 rounded-lg flex justify-between items-center ${resolvedTheme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
                >
                  <div>
                    <span className="block text-xs text-black dark:text-gray-300 ">
                      {format(new Date(link.date), "PPPP")} at {link.time}
                    </span>
                  </div>
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

          {/* ✅ Show "Add Session Link" only if user is a mentor */}
          {session?.user?.role === "mentor" && (
            <div className="mt-4 space-y-2">
              <input
                type="text"
                placeholder="Paste session link..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="datetime-local"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={addSession}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* ✅ Right Side: Chat Section */}
        <div
          className={`rounded-lg shadow-lg flex flex-col h-full ${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Chat</h2>
          </div>

          {/* ✅ Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[70vh]"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === studentId ? "justify-end" : "justify-start"}`}
              >
                <div className="p-4 rounded-lg bg-gray-700 text-white shadow-md">
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Message Input */}
          <form
            onSubmit={sendMessage}
            className="p-5 border-t border-gray-700 flex items-center space-x-4"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
