"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Search = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get existing expertise filter from URL
    const [expertise, setExpertise] = React.useState(searchParams.get("expertise") || "");

    React.useEffect(() => {
        setExpertise(searchParams.get("expertise") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams(searchParams);

        if (expertise) newSearchParams.set("expertise", expertise);
        else newSearchParams.delete("expertise");

        router.push(`${pathname}?${newSearchParams}`);
    };

    return (
        <form className="flex w-full flex-wrap gap-4 items-center" onSubmit={handleSearch}>
            {/* Expertise Search Input */}
            <Input
                type="text"
                placeholder="Search by expertise (e.g., Web Development, AI, UI/UX)"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="flex-1"
            />

            {/* Search Button */}
            <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                Search
            </button>
        </form>
    );
};

export default Search;
