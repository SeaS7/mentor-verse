"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import convertDateToRelativeTime from "@/utils/relativeTime";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract userId safely
  const userId =  session?.user?._id;

  useEffect(() => {
    if (status === "loading") return;
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, status]); 

  if (loading) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-500">User not found.</p>;
  }

  return (
    <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* User Profile Picture */}
        <div className="w-40 shrink-0">
          <picture className="block w-full">
            <img
              src={user.profileImg || "/default-avatar.png"}
              alt={user.username || "User"}
              className="h-full w-full rounded-xl object-cover"
            />
          </picture>
        </div>

        {/* User Info */}
        <div className="w-full">
          <div className="flex items-start justify-between">
            <div className="block space-y-0.5">
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-lg text-gray-500">{user.email}</p>
              <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
                <IconUserFilled className="w-4 shrink-0" /> Joined{" "}
                {convertDateToRelativeTime(new Date(user.createdAt))}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <IconClockFilled className="w-4 shrink-0" /> Last activity&nbsp;
                {convertDateToRelativeTime(new Date(user.updatedAt))}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                ⭐ Reputation: <strong>{user.reputation || 0}</strong>
              </p>
            </div>

            <div className="shrink-0">
              <EditButton />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Content */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Navbar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
