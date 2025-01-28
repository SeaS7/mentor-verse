"use client";

import QuestionCard from "@/components/QuestionCard";
import axios from "axios";
import React, { useEffect, useState } from "react";

const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="h-32 min-w-80 rounded-lg bg-gray-300 dark:bg-gray-700"
      ></div>
    ))}
  </div>
);

const LatestQuestions = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestQuestions = async () => {
      try {
        const response = await axios.get(`/api/questions`, {
          params: { limit: 5 },
        });

        setQuestions(response.data.data);
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
        <SkeletonLoader />
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
