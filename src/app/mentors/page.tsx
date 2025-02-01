"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import MentorCard from "@/components/MentorCard"; 

function MentorsList() {
  const searchParams = useSearchParams();
  const [mentors, setMentors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchText = searchParams.get("search") || "";
  const expertiseFilter = searchParams.get("expertise") || "";
  const limit = 10;

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/mentors`, {
          params: { page, limit, expertise: expertiseFilter, search: searchText },
        });

        setMentors(response.data.data);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [page, expertiseFilter, searchText]);

  return (
    <div className="container mx-auto px-4 pb-10 pt-24">
      <div className="mb-10 pb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Find Your Mentor</h1>
        <Link href="/questions/ask">
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Ask a Question
            </span>
          </ShimmerButton>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-wrap gap-4 w-full">
        <Search />
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        {loading ? "Fetching mentors..." : `${total} mentors available`}
      </p>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
        {loading ? (
          // Skeleton Loader while fetching data
          [...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"
            ></div>
          ))
        ) : mentors.length > 0 ? (
          mentors.map((mentor: any) => (
            <MentorCard key={mentor._id.toString()} mentor={mentor} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No mentors found.</p>
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
    <Suspense fallback={<p>Loading mentors...</p>}>
      <MentorsList />
    </Suspense>
  );
}
