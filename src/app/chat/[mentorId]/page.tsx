"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import ChatCard from "@/components/ChatCard";
import SessionCard from "@/components/SessionCard";

export default function Chat() {
  const { data: session } = useSession();
  const { mentorId } = useParams() as { mentorId: string };
  const studentId = session?.user?._id;
  const isMentor = session?.user?.role === "mentor";
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`flex items-center pt-14 justify-center h-screen w-full pb-10 ${
        resolvedTheme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="grid grid-cols-2 gap-6 w-full max-w-6xl h-[90vh]">
        {/* ✅ Session Section */}
        <SessionCard studentId={studentId} mentorId={mentorId} isMentor={isMentor} />

        {/* ✅ Chat Section */}
        <ChatCard studentId={studentId} mentorId={mentorId} isMentor={isMentor} />
      </div>
    </div>
  );
}
