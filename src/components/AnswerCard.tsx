"use client";

import { useSession } from "next-auth/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Comments from "./Comments";
import VoteButtons from "./VoteButtons";
import { IconTrash } from "@tabler/icons-react";
import { MarkdownPreview } from "./RTE";
import slugify from "@/utils/slugify";
import Link from "next/link";

const Answer = ({
  answer,
  onDelete,
}: {
  answer: any;
  onDelete: (id: string) => void;
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const { data: session } = useSession();

  // Fetch comments and votes for this answer
  useEffect(() => {
    const fetchCommentsAndVotes = async () => {
      try {
        const [commentsRes, upvotesRes, downvotesRes] = await Promise.allSettled([
          axios.get(`/api/comments?type=answer&typeId=${answer._id}`),
          axios.get(`/api/votes`, { params: { type: "answer", typeId: answer._id, status: "upvoted" } }),
          axios.get(`/api/votes`, { params: { type: "answer", typeId: answer._id, status: "downvoted" } }),
        ]);

        if (commentsRes.status === "fulfilled") {
          setComments(commentsRes.value.data.data || []);
        }
        if (upvotesRes.status === "fulfilled" && downvotesRes.status === "fulfilled") {
          setVotes({
            upvotes: upvotesRes.value.data.count || 0,
            downvotes: downvotesRes.value.data.count || 0,
          });
        }
      } catch (error) {
        console.error(`Error fetching data for answer ${answer._id}:`, error);
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };

    fetchCommentsAndVotes();
  }, [answer._id]);

  return (
    <div className="flex gap-4">
      <div className="flex shrink-0 flex-col items-center gap-4">
        {!loading ? (
          <VoteButtons
            type="answer"
            id={answer._id}
            upvotesCount={votes.upvotes}
            downvotesCount={votes.downvotes}
          />
        ) : (
          <div className="animate-pulse w-12 h-5 bg-gray-200 rounded-md" />
        )}
        {session?.user?._id === answer.authorId?._id && (
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
            onClick={() => onDelete(answer._id)}
          >
            <IconTrash className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="w-full overflow-auto">
        <div className="rounded-xl p-4">
          <MarkdownPreview source={answer.content} />
        </div>
        <div className="mt-4 flex items-center justify-end gap-1">
          <picture>
            <img
              src={answer.authorId?.profileImg || "/default-avatar.png"}
              alt={answer.authorId?.username || "User"}
              className="rounded-lg w-9 h-9"
            />
          </picture>
          <div className="block leading-tight">
            <Link
              href={`/users/${answer.authorId?._id || "unknown"}/${slugify(answer.authorId?.username || "anonymous")}`}
              className="text-orange-500 hover:text-orange-600"
            >
              {answer.authorId?.username || "Anonymous"}
            </Link>
            <p>
              <strong>{answer.authorId?.reputation || 0}</strong>
            </p>
          </div>
        </div>
        {!commentsLoading ? (
          <Comments
            initialComments={comments}
            className="mt-4"
            type="answer"
            typeId={answer._id}
          />
        ) : (
          <div className="animate-pulse w-full h-10 bg-gray-200 rounded-md" />
        )}
        <hr className="my-4 border-white/40" />
      </div>
    </div>
  );
};

export default Answer;
