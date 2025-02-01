"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import Pagination from "@/components/Pagination";
import Search from "./Search";

function QuestionsList() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchText = searchParams.get("search") || "";
  const tagSearch = searchParams.get("tag") || "";
  const limit = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/questions/pagenated-ques`, {
          params: { page, limit, tag: tagSearch, search: searchText },
        });

        setQuestions(response.data.data);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page, tagSearch, searchText]); // ✅ Proper dependencies for useEffect

  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-10 pb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link href="/questions/ask">
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Ask a question
            </span>
          </ShimmerButton>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-wrap gap-4 w-full">
        <Search />
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        {loading ? "Fetching questions..." : `${total} questions found`}
      </p>

      {/* Full Page Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
        {loading ? (
          // Skeleton Loader while fetching data
          [...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"
            ></div>
          ))
        ) : questions.length > 0 ? (
          questions.map((ques: any) => (
            <QuestionCard key={ques._id.toString()} ques={ques} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No questions found.</p>
        )}
      </div>
      <div className="mt-10">
        <Pagination total={total} limit={limit} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading questions...</p>}>
      <QuestionsList />
    </Suspense>
  );
}
