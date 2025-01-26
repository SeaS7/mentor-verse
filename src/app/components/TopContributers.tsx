"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import { useEffect, useState } from "react";
import axios from "axios";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { getProfileImage } from "@/utils/getProfileImage";

const Notification = ({ user }: { user: any }) => {

  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full min-w-24 max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-gray-100 shadow-md dark:bg-gray-900 dark:shadow-md"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{user.username}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">
              {convertDateToRelativeTime(new Date(user.updatedAt))}
            </span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            <span>Reputation</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{user.reputation}</span>
          </p>
        </div>
      </div>
    </figure>
  );
};

export default function TopContributers() {
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(`/api/users/top`);
        setTopUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching top contributors:", error);
      }
    };
    fetchTopUsers();
  }, []);

  return (
    <div className="bg-background relative flex lg:h-[600px] mid:max-h-[400px] mid:min-h-[400px] lg:w-[32rem] mid:w-full mid:max-w-[32rem] flex-col overflow-hidden rounded-lg p-6 shadow-lg">
      <AnimatedList>
        {topUsers.map((user) => (
          <Notification user={user} key={user._id} />
        ))}
      </AnimatedList>
    </div>
  );
}
