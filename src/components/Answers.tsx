"use client";

import React, { useState } from "react";
import axios from "axios";
import RTE from "./RTE";
import Answer from "./AnswerCard";

const Answers = ({
  initialAnswers,
  questionId,
}: {
  initialAnswers: any[];
  questionId: string;
}) => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [newAnswer, setNewAnswer] = useState("");

  // Handle submitting a new answer
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/answer", {
        questionId,
        content: newAnswer,
        authorId: "CURRENT_USER_ID", // Replace with actual user ID
      });

      setNewAnswer("");
      setAnswers([response.data.data, ...answers]);
    } catch (error: any) {
      console.error("Error posting answer:", error);
    }
  };

  // Handle deleting an answer
  const deleteAnswer = async (answerId: string) => {
    try {
      await axios.delete(`/api/answers?id=${answerId}`);
      setAnswers(answers.filter((answer) => answer._id !== answerId));
    } catch (error: any) {
      console.error("Error deleting answer:", error);
    }
  };

  return (
    <>
      <h2 className="mb-4 text-xl">{answers.length} Answers</h2>
      {answers.map((answer) => (
        <Answer key={answer._id} answer={answer} onDelete={deleteAnswer} />
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
