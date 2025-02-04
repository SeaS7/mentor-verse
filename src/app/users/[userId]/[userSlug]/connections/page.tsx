"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Importing the `useRouter` hook

// Define TypeScript Interfaces
interface User {
  _id: string;
  username: string;
  email: string;
  profileImg: string;
  reputation: number;
}

interface Connection {
  _id: string;
  studentId: User;
  mentorId: User | null;
  agreedAmount: number;
  isPaid: boolean;
  createdAt: string;
}

const ConnectionsPage = () => {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Initializing the router

  useEffect(() => {
    const fetchConnections = async () => {
      if (!session?.user?.role) return;

      try {
        setLoading(true);
        const res = await axios.get<{ data: Connection[] }>("/api/connections");
        let filteredConnections = res.data.data || [];

        if (session.user.role === "mentor") {
          filteredConnections = filteredConnections.filter(
            (conn) => conn.mentorId && conn.mentorId._id === session.user._id
          );
        } else if (session.user.role === "student") {
          filteredConnections = filteredConnections.filter(
            (conn) => conn.studentId._id === session.user._id
          );
        }

        setConnections(filteredConnections);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [session?.user?.role]);

  const goToChat = (connection: Connection) => {
    const otherMemberId =
      session?.user.role === "mentor"
        ? connection.studentId._id
        : connection.mentorId?._id;

    if (otherMemberId) {
      // Navigate to the chat page with the other member's ID
      router.push(`/chat/${otherMemberId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Your Connections</h1>

      {/* ✅ Show Loading Indicator */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : connections.length === 0 ? (
        <p className="text-gray-500">No connections found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className="border p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4">
                {/* ✅ Profile Image */}
                <Image
                  src={
                    session?.user.role === "mentor"
                      ? connection.studentId.profileImg
                      : connection.mentorId?.profileImg || "/default-avatar.png"
                  }
                  alt="Profile Image"
                  width={60}
                  height={60}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  {/* ✅ Show Student for Mentor & Mentor for Student */}
                  <h2 className="text-lg font-semibold">
                    {session?.user.role === "mentor"
                      ? connection.studentId.username
                      : connection.mentorId?.username || "Unknown"}
                  </h2>
                  <p className="text-gray-500">
                    Reputation:{" "}
                    {session?.user.role === "mentor"
                      ? connection.studentId.reputation
                      : connection.mentorId?.reputation || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full mt-2">
                {/* ✅ Left Side: Agreed Amount & Payment Status */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Agreed Amount:{" "}
                    <span className="font-bold">
                      ${connection.agreedAmount}
                    </span>
                  </p>

                  <p className="text-sm">
                    Payment Status:{" "}
                    <span
                      className={`font-semibold ${connection.isPaid ? "text-green-500" : "text-red-500"}`}
                    >
                      {connection.isPaid ? "Paid" : "Pending"}
                    </span>
                  </p>
                </div>

                {/* ✅ Right Side: Button */}
                <button
                  onClick={() => goToChat(connection)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
