"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { format } from "date-fns";
import { useTheme } from "next-themes";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  seen: boolean;
  createdAt?: any;
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
  const { resolvedTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!studentId || !mentorId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Message
      );

      setMessages(messagesData);

      messagesData.forEach(async (msg) => {
        if (msg.receiverId === studentId && !msg.seen) {
          await updateDoc(doc(db, "chats", chatId, "messages", msg.id), {
            seen: true,
          });

          try {
            await fetch("/api/notifications", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sourceId: mentorId, userId: studentId }),
            });
          } catch (error) {
            console.error("❌ Error deleting notification:", error);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [studentId, mentorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!studentId || !mentorId || !newMessage.trim()) return;
    setLoading(true);

    const messageData: Partial<Message> = {
      senderId: studentId,
      receiverId: mentorId,
      message: newMessage,
      seen: false,
      createdAt: serverTimestamp(),
    };

    // 🔥 Save message to Firestore
    const messageRef = await addDoc(collection(db, "chats", chatId, "messages"), messageData);

    // 🔥 Send a notification to MongoDB
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: mentorId, // Receiver of the message
          type: "message",
          sourceId: studentId, // Message ID from Firestore
          message: `New message from ${session?.user?.name}: ${newMessage}`,
        }),
      });
    } catch (error) {
      console.error("❌ Error creating notification:", error);
    }

    setNewMessage("");
    setLoading(false);
  };

  return (
    <div
      className={`flex items-center justify-center h-screen w-full ${
        resolvedTheme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`flex flex-col h-[90vh] w-full max-w-4xl ${
          resolvedTheme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
        } rounded-lg shadow-lg overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            resolvedTheme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <h2 className="text-xl font-semibold">Chat</h2>
        </div>

        {/* Messages Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: "70vh" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === studentId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[60%] p-4 rounded-lg shadow-md ${
                  msg.senderId === studentId
                    ? "bg-blue-600 text-white"
                    : resolvedTheme === "dark"
                    ? "bg-[#333] text-gray-300"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="break-words">{msg.message}</p>
                <span className="text-xs mt-1 block text-right">
                  {msg.createdAt?.seconds
                    ? format(new Date(msg.createdAt.seconds * 1000), "HH:mm")
                    : "Sending..."}
                  {msg.senderId === studentId && (
                    <span className="ml-2">
                      {msg.seen ? "✓✓" : "✓"} {/* ✅ Seen Indicator */}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-5 border-t ${resolvedTheme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
          <div className="flex items-center space-x-4">
            {/* Message Input */}
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={`flex-1 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                resolvedTheme === "dark"
                  ? "bg-[#404040] text-white focus:ring-blue-500"
                  : "bg-gray-100 text-gray-900 focus:ring-blue-400"
              }`}
            />

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition disabled:opacity-50"
              disabled={loading || !newMessage.trim()}
            >
              {loading ? "..." : "➤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
