"use client";

import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Page() {
  const { userId } = useParams();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 25;

  useEffect(() => {
    if (!userId) return;

    const fetchAnswers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/answer/user/${userId}`, {
          params: { page, limit },
        });

        setAnswers(response.data.data);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching answers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [userId, page]);

  const SkeletonLoader = () => {
    return (
      <div className="animate-pulse space-y-4">
        {/* Title placeholder */}
        <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
  
        {/* Content placeholder */}
        <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700"></div>
  
        {/* Button Placeholder */}
        <div className="h-10 w-32 rounded bg-gray-400 dark:bg-gray-600"></div>
      </div>
    );
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-4">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
          {total} {total === 1 ? "answer" : "answers"}
        </p>
      </div>

      <div className="mb-4 max-w-3xl space-y-6">
        {loading ? (
          // Show skeleton loader while loading
          [...Array(5)].map((_, index) => <SkeletonLoader key={index} />)
        ) : answers.length > 0 ? (
          answers.map((ans) => (
            <div className="w-full overflow-auto">
              <div className="max-h-40 overflow-auto">
                <MarkdownPreview source={ans.content} />
              </div>
              {ans.questionId ? (
                <Link
                  href={`/questions/${ans.questionId._id}/${slugify(ans.questionId.title)}`}
                  className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                >
                  View Question
                </Link>
              ) : (
                <p className="mt-3 text-sm text-red-500">Question data unavailable.</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No answers found.</p>
        )}
      </div>

      <Pagination total={total} limit={limit} />
    </div>
  );
}
