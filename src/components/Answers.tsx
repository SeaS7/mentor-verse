"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import VoteButtons from "./VoteButtons";
import { IconTrash } from "@tabler/icons-react";
import RTE, { MarkdownPreview } from "./RTE";
import Comments from "./Comments";
import slugify from "@/utils/slugify";
import Link from "next/link";

const Answers = ({
  initialAnswers,
  questionId,
}: {
  initialAnswers: any[];
  questionId: string;
}) => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [newAnswer, setNewAnswer] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAnswer || !session?.user) {
      alert("Please login to post an answer.");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.post("/api/answers", {
        questionId,
        content: newAnswer,
        authorId: session.user.id,
      });

      setNewAnswer("");
      setAnswers([
        {
          ...response.data.data,
          author: session.user,
          upvotes: 0,
          downvotes: 0,
          comments: [],
        },
        ...answers,
      ]);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error posting answer");
    }
  };

  const deleteAnswer = async (answerId: string) => {
    try {
      await axios.delete(`/api/answers?id=${answerId}`);
      setAnswers(answers.filter((answer) => answer._id !== answerId));
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error deleting answer");
    }
  };

  return (
    <>
      <h2 className="mb-4 text-xl">{answers.length} Answers</h2>
      {answers.map((answer) => (
        <div key={answer._id} className="flex gap-4">
          <div className="flex shrink-0 flex-col items-center gap-4">
            <VoteButtons
              type="answer"
              id={answer._id}
              upvotesCount={answer.upvotes}
              downvotesCount={answer.downvotes}
            />
            {session?.user?.id === answer.authorId && (
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
                onClick={() => deleteAnswer(answer._id)}
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
                  src={answer.author?.image || "/default-avatar.png"}
                  alt={answer.author?.name || "User"}
                  className="rounded-lg w-9 h-9"
                />
              </picture>
              <div className="block leading-tight">
                <Link
                  href={`/users/${answer.authorId}/${slugify(answer.author?.name || "anonymous")}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {answer.author?.name || "Anonymous"}
                </Link>
                <p>
                  <strong>{answer.author?.reputation || 0}</strong>
                </p>
              </div>
            </div>
            <Comments initialComments={answer.comments} className="mt-4" type="answer" typeId={answer._id} />
            <hr className="my-4 border-white/40" />
          </div>
        </div>
      ))}
      <hr className="my-4 border-white/40" />
      <form onSubmit={handleSubmit} className="space-y-2">
        <h2 className="mb-4 text-xl">Your Answer</h2>
        <RTE value={newAnswer} onChange={(value) => setNewAnswer(value || "")} />
        <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
          Post Your Answer
        </button>
      </form>
    </>
  );
};

export default Answers;
