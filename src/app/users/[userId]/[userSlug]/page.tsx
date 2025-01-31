"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import NumberTicker from "@/components/magicui/number-ticker";
import convertDateToRelativeTime from "@/utils/relativeTime";
import  Skeleton  from "@/components/ui/skeleton";
import { IconCamera } from "@tabler/icons-react";

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState(0);
  const [answers, setAnswers] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!userId && !session?.user?._id) return;

    const finalUserId = userId || session?.user?._id;

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const [userRes, questionRes, answerRes, notificationsRes] = await Promise.all([
          axios.get(`/api/users/${finalUserId}`),
          axios.get(`/api/questions/user/${finalUserId}`),
          axios.get(`/api/answer/user/${finalUserId}`),
          axios.get(`/api/notifications/${finalUserId}`),
        ]);

        setUser(userRes.data.user);
        setQuestions(questionRes.data.total);
        setAnswers(answerRes.data.total);
        setNotifications(notificationsRes.data.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, session?.user?._id]);

  return (
    <div className="container mx-auto px-4 pb-20">
      

      {/* Stats Section */}
      <MagicContainer className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
        {[{ title: "Reputation", value: user?.reputation || 0 },
          { title: "Questions Asked", value: questions },
          { title: "Answers Given", value: answers }].map((stat, index) => (
          <MagicCard key={index} className="flex flex-col items-center justify-center p-6 shadow-lg">
            <h2 className="text-xl font-medium">{stat.title}</h2>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                <NumberTicker value={stat.value} />
              </p>
            )}
          </MagicCard>
        ))}
      </MagicContainer>

      {/* Notifications */}
      <h2 className="mt-10 text-2xl font-bold">Recent Activity</h2>
      <div className="mt-4 space-y-4">
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="border p-4 rounded-md shadow-md dark:border-gray-700">
              <p className="text-sm text-gray-500">
                {convertDateToRelativeTime(new Date(notification.createdAt))}
              </p>
              <p className="font-medium">{notification.message}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
