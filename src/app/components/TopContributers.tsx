"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import { useEffect, useState } from "react";
import axios from "axios";
import convertDateToRelativeTime from "@/utils/relativeTime";

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

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="relative mx-auto h-20 w-full max-w-[400px] rounded-2xl bg-gray-300 dark:bg-gray-700"
          ></div>
        ))}
    </div>
  );
};

export default function TopContributers() {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true); // Set loading state to true
        const response = await axios.get(`/api/users/top`);
        setTopUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching top contributors:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };
    fetchTopUsers();
  }, []);

  return (
    <div className="bg-background relative flex lg:h-[600px] mid:max-h-[400px] mid:min-h-[400px] lg:w-[32rem] mid:w-full mid:max-w-[32rem] flex-col overflow-hidden rounded-lg p-6 shadow-lg">
      {loading ? (
        <SkeletonLoader />
      ) : (
        <AnimatedList>
          {topUsers.map((user) => (
            <Notification user={user} key={user._id} />
          ))}
        </AnimatedList>
      )}
    </div>
  );
}
