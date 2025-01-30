"use client";

import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

const VoteButtons = ({
  type,
  id,
  upvotesCount,
  downvotesCount,
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotesCount: number;
  downvotesCount: number;
  className?: string;
}) => {
  const [voteStatus, setVoteStatus] = useState<"upvoted" | "downvoted" | null>(
    null
  );
  const [voteResult, setVoteResult] = useState<number>(
    upvotesCount - downvotesCount
  );

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (session?.user?._id) {
        try {
          const response = await axios.get(`/api/users/user-vote`, {
            params: {
              type,
              typeId: id,
              votedById: session.user._id,
            },
          });

          if (response.data.success && response.data.vote) {
            setVoteStatus(response.data.vote.voteStatus);
          }
        } catch (error) {
          console.error("Error fetching vote status:", error);
        }
      }
    };

    fetchVoteStatus();
  }, [session, id, type]);

  const handleVote = async (newVoteStatus: "upvoted" | "downvoted") => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.post(`/api/votes`, {
        votedById: session.user._id,
        voteStatus: newVoteStatus,
        type,
        typeId: id,
      });

      if (response.data.success) {
        setVoteStatus(response.data.voteStatus);
        setVoteResult(response.data.voteResult);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-y-4", className)}>
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 transition-all hover:bg-white/10",
          voteStatus === "upvoted"
            ? "border-orange-500 text-orange-500"
            : "border-gray-300 dark:border-white/30"
        )}
        onClick={() => handleVote("upvoted")}
      >
        <IconCaretUpFilled />
      </button>
      <span>{voteResult || 0}</span>
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 transition-all hover:bg-white/10",
          voteStatus === "downvoted"
            ? "border-orange-500 text-orange-500"
            : "border-gray-300 dark:border-white/30"
        )}
        onClick={() => handleVote("downvoted")}
      >
        <IconCaretDownFilled />
      </button>
    </div>
  );
};

export default VoteButtons;
