"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { useToast } from "@/components/ui/use-toast"; // ✅ Import custom toast hook

const Comments = ({
  initialComments,
  type,
  typeId,
  className,
}: {
  initialComments: any[];
  type: "question" | "answer";
  typeId: string;
  className?: string;
}) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast(); // ✅ Custom toast hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to comment.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter a valid comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post("/api/comments", {
        content: newComment,
        authorId: session.user._id,
        type,
        typeId,
      });

      setNewComment("");
      setComments([response.data.data, ...comments]);
      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully!",
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to delete a comment.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.delete(`/api/comments?id=${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast({
        title: "Comment Deleted",
        description: "Your comment has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 pl-4", className)}>
      {comments?.length > 0 ? (
        comments.map((comment) => (
          <React.Fragment key={comment._id}>
            <hr className="border-white/40" />
            <div className="flex gap-2">
              <p className="text-sm">
                {comment.content} -{" "}
                <a
                  href={`/users/${comment.authorId}/${slugify(
                    comment.author?.name || "Anonymous"
                  )}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {comment.author?.name || "Anonymous"}
                </a>{" "}
                <span className="opacity-60">
                  {convertDateToRelativeTime(new Date(comment.createdAt))}
                </span>
              </p>
              {session?.user?._id === comment.authorId && (
                <button
                  onClick={() => deleteComment(comment._id)}
                  className="shrink-0 text-red-500 hover:text-red-600"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              )}
            </div>
          </React.Fragment>
        ))
      ) : (
        <p className="text-sm opacity-60">No comments yet.</p>
      )}
      <hr className="border-white/40" />
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <textarea
          className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
          rows={1}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
        >
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default Comments;
