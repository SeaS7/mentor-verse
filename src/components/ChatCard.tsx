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
import { db } from "@/lib/firebaseConfig";
import { useTheme } from "next-themes";
import axios from "axios";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  seen: boolean;
  createdAt?: any;
}

interface UserProfile {
  _id: string;
  username: string;
  profileImg: string;
}

// ✅ Define Props Interface
interface ChatCardProps {
  studentId: string;
  mentorId: string;
  isMentor: boolean;
}

export default function ChatCard({ studentId, mentorId, isMentor }: ChatCardProps) {
  const chatId = isMentor ? `${mentorId}-${studentId}` : `${studentId}-${mentorId}`;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { resolvedTheme } = useTheme();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [mentor, setMentor] = useState<UserProfile | null>(null);
  const [student, setStudent] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false); // ✅ Added state for fullscreen mode

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const [mentorRes, studentRes] = await Promise.all([
          axios.get(`/api/users/${mentorId}`),
          axios.get(`/api/users/${studentId}`),
        ]);

        setMentor(mentorRes.data.user);
        setStudent(studentRes.data.user);
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [studentId, mentorId]);

  useEffect(() => {
    if (!studentId || !mentorId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Message
      );

      setMessages(messagesData);

      const unreadMessages = messagesData.filter(
        (msg) => !msg.seen && msg.receiverId === studentId
      );
      setUnreadCount(unreadMessages.length);

      if (unreadMessages.length > 0) {
        toast({
          title: "New Message",
          description: `You have ${unreadMessages.length} unread message(s).`,
          variant: "default",
        });
      }

      unreadMessages.forEach(async (message) => {
        await updateDoc(doc(db, "chats", chatId, "messages", message.id), {
          seen: true,
        });
      });

      if (unreadMessages.length > 0) {
        setUnreadCount(0);
      }
    });

    return () => unsubscribe();
  }, [studentId, mentorId]);

  // ✅ Send New Message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !mentorId || !newMessage.trim()) return;

    const messageData: Partial<Message> = {
      senderId: studentId,
      receiverId: mentorId,
      message: newMessage,
      seen: false,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "chats", chatId, "messages"), messageData);
    setNewMessage("");
  };

  return (
    <div
      className={`rounded-lg shadow-lg flex flex-col ${
        isFullScreen ? "fixed inset-0 z-50 p-6 bg-black" : "h-full"
      } ${resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* ✅ Chat Header with Profile Image, Name & Full-Screen Button */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {mentor && student ? (
          <div className="flex items-center space-x-3">
            <Image
              src={
                isMentor
                  ? student.profileImg || "/default-avatar.png"
                  : mentor.profileImg || "/default-avatar.png"
              }
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full border"
            />
            <h2 className="text-xl font-semibold">
              {isMentor ? student.username : mentor.username}
            </h2>
          </div>
        ) : (
          <h2 className="text-xl font-semibold">Loading...</h2>
        )}

        <div className="flex items-center space-x-2">
          {/* ✅ Notification for Unread Messages */}
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
              {unreadCount} New Message(s)
            </span>
          )}

          {/* ✅ Full-Screen Toggle Button */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {isFullScreen ? (
              <IconMinimize className="w-6 h-6 text-white" />
            ) : (
              <IconMaximize className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* ✅ Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[70vh]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-center ${msg.senderId === studentId ? "justify-end" : "justify-start"}`}>
            {/* ✅ Show Sender Image & Name */}
            {msg.senderId !== studentId && (
              <Image
                src={mentorId === msg.senderId ? mentor?.profileImg || "/default-avatar.png" : student?.profileImg || "/default-avatar.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border mr-2"
              />
            )}

            <div className={`p-4 rounded-lg shadow-md relative max-w-sm ${msg.senderId === studentId ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}>
              <p>{msg.message}</p>
              <span className="text-xs absolute -bottom-4 right-0 text-gray-400">
                {msg.seen ? "✔ Seen" : "📩 Sent"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Message Input */}
      <form onSubmit={sendMessage} className="p-5 border-t border-gray-700 flex items-center space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          ➤
        </button>
      </form>
    </div>
  );
}
