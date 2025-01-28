"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { useSession } from "next-auth/react";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import axios from "axios";
import Link from "next/link";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { TracingBeam } from "@/components/ui/tracing-beam";

const Page = () => {
  const params = useParams(); // Dynamically fetch params
  const quesId = params?.quesId as string; // Extract quesId

  const { data: session } = useSession();

  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState([]);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [avatars, setAvatars] = React.useState<string | null>(null);

  useEffect(() => {
    if (!quesId) return;

    const fetchQuestionData = async () => {
      try {
        const [questionRes, answersRes, upvoteRes, downvoteRes, commentsRes] =
          await Promise.all([
            axios.get(`/api/questions/${quesId}`),
            axios.get(`/api/answer?questionId=${quesId}`),
            axios.get(
              `/api/votes?type=question&typeId=${quesId}&status=upvoted`
            ),
            axios.get(
              `/api/votes?type=question&typeId=${quesId}&status=downvoted`
            ),
            axios.get(`/api/comments?type=question&typeId=${quesId}`),
          ]);

        setQuestion(questionRes.data.data);
        setAnswers(answersRes.data.data);
        setUpvotes(upvoteRes.data.count || 0);
        setDownvotes(downvoteRes.data.count || 0);
        setComments(commentsRes.data.data);
      } catch (error) {
        console.error("Error fetching question details:", error);
      }
    };

    fetchQuestionData();
  }, [quesId]);

  if (!question) {
    return <div className="text-center mt-10 text-lg">Loading question...</div>;
  }


  

  return (
    <TracingBeam className="container pl-6">
      <div className="relative mx-auto px-4 pb-20 pt-36">
        <div className="flex">
          <div className="w-full">
            <h1 className="mb-1 text-3xl font-bold">{question.title}</h1>
            <div className="flex gap-4 text-sm">
              <span>
                Asked {convertDateToRelativeTime(new Date(question.createdAt))}
              </span>
              <span>Answers {answers.length || 0}</span>
              <span>
                Votes {isNaN(upvotes - downvotes) ? "0" : upvotes - downvotes}
              </span>
            </div>
          </div>
          <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
            <ShimmerButton className="shadow-2xl">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                Ask a question
              </span>
            </ShimmerButton>
          </Link>
        </div>
        <hr className="my-4 border-white/40" />
        <div className="flex gap-4">
          <div className="flex shrink-0 flex-col items-center gap-4">
            <VoteButtons
              type="question"
              id={question._id}
              upvotesCount={upvotes}
              downvotesCount={downvotes}
            />
            {session?.user?._id === question.authorId && (
              <>
                <EditQuestion
                  questionId={question._id}
                  questionTitle={question.title}
                  authorId={question.authorId}
                />
                <DeleteQuestion
                  questionId={question._id}
                  authorId={question.authorId}
                />
              </>
            )}
          </div>
          <div className="w-full overflow-auto">
            <div className="rounded-xl p-4">
              <MarkdownPreview source={question.content} />
            </div>
            {question.attachmentId && (
              <img
                src={question.attachmentId}
                alt={question.title}
                className="mt-3 rounded-lg"
              />
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              {question.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/questions?tag=${tag}`}
                  className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-1">
              <picture>
                <img
                  src={avatars || "/public/defaultUser.png"}
                  alt={question?.author?.name || "Unknown Author"}
                  className="rounded-lg"
                />
              </picture>
              <div className="block leading-tight">
                <Link
                  href={`/users/${question.authorId}/${slugify(question?.author?.name || "")}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {question?.author?.name || "Anonymous"}
                </Link>
                <p>
                  <strong>{question?.author?.reputation || 0}</strong>
                </p>
              </div>
            </div>
            <Comments
              initialComments={comments}
              type="question"
              typeId={question._id}
              className="mt-4"
            />
            <hr className="my-4 border-white/40" />
          </div>
        </div>
        <Answers initialAnswers={answers} questionId={question._id} />
      </div>
    </TracingBeam>
  );
};

export default Page;
