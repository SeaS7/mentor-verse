"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import convertDateToRelativeTime from "@/utils/relativeTime";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { IconClockFilled, IconUserFilled, IconCamera, IconLoader } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // ✅ Track upload status
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = session?.user?._id;

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

  // Handle File Selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    setUploading(true); // ✅ Start loading state

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await axios.post("/api/users/profile-image", formData);
      if (response.data.success) {
        setUser((prevUser: any) => ({ ...prevUser, profileImg: response.data.profileImg }));
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setUploading(false); // ✅ End loading state
    }
  };

  if (loading) {
    return (
      <div className="relative flex justify-center items-center mt-40">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-black dark:border-white"></div>
        <img
          src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
          className="rounded-full h-28 w-28"
        />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-red-500">User not found.</p>;
  }

  return (
    <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Profile Picture with Edit Button */}
        <div className="relative w-40 shrink-0">
          <div className="relative">
            <img
              src={user.profileImg || "/default-avatar.png"}
              alt={user.username || "User"}
              className="h-40 w-40 rounded-full object-cover"
            />
            
            {/* Loading Overlay */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <IconLoader className="animate-spin text-white" size={40} />
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full shadow-md"
              disabled={uploading}
            >
              <IconCamera size={20} />
            </button>

            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
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
