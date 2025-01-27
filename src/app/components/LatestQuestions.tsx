"use client";

import QuestionCard from "@/components/QuestionCard";
import { getUserAndQuestionStats } from "@/utils/questionStats";
import axios from "axios";
import React, { useEffect, useState } from "react";

const LatestQuestions = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestQuestions = async () => {
      try {
        // Fetch latest 5 questions
        const questionRes = await axios.get(
          `/api/questions`,
          {
            params: { limit: 5 },
          }
        );
        const questionData = await Promise.all(
          questionRes.data.data.map(async (ques: any) => {

            const result = await getUserAndQuestionStats(ques.authorId, ques._id);
            // const [answersRes, votesRes] = await Promise.all([
            //   axios.get(`/api/answer`, {
            //     params: { questionId: ques._id},
            //   }),
            //   axios.get(`/api/votes`, {
            //     params: { type: "question", typeId: ques._id},
            //   }),
            // ]);

            return {
              ...ques,
              result,
              // totalAnswers: answersRes.data.length(),
              // totalVotes: votesRes.data.length(),
              // author: ques.author,
            };
          })
        );

        setQuestions(questionData);
      } catch (error) {
        console.error("Error fetching latest questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestQuestions();
  }, []);

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading latest questions...</p>
      ) : questions.length > 0 ? (
        questions.map((question) => (
          <QuestionCard key={question._id} ques={question} />
        ))
      ) : (
        <p className="text-center text-gray-500">No questions found.</p>
      )}
    </div>
  );
};

export default LatestQuestions;
