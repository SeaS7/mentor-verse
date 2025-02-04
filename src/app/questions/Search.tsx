"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Search = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Retrieve search values from URL or default to empty
    const [search, setSearch] = React.useState(searchParams.get("search") || "");
    const [tag, setTag] = React.useState(searchParams.get("tag") || "");

    // Sync search state with URL parameters
    React.useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setTag(searchParams.get("tag") || "");
    }, [searchParams]);

    // Handle search submission
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newSearchParams = new URLSearchParams(searchParams);

        if (search.trim()) {
            newSearchParams.set("search", search.trim());
        } else {
            newSearchParams.delete("search");
        }

        if (tag.trim()) {
            newSearchParams.set("tag", tag.trim().toLowerCase());
        } else {
            newSearchParams.delete("tag");
        }

        router.push(`${pathname}?${newSearchParams.toString()}`);
    };

    return (
        <form className="flex w-full items-center gap-2" onSubmit={handleSearch}>
            {/* Search by Question Title */}
            <Input
                type="text"
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
            />

            {/* Search by Tag */}
            <Input
                type="text"
                placeholder="Search by tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="flex-1"
            />

            {/* Search Button */}
            <button
                className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                type="submit"
            >
                Search
            </button>
        </form>
    );
};

export default Search;
