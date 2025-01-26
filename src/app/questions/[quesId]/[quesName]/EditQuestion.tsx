"use client";

import { useSession } from "next-auth/react";
import slugify from "@/utils/slugify";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const EditQuestion = ({
    questionId,
    questionTitle,
    authorId,
}: {
    questionId: string;
    questionTitle: string;
    authorId: string;
}) => {
    const { data: session } = useSession();

    return session?.user?._id === authorId ? (
        <Link
            href={`/questions/${questionId}/${slugify(questionTitle)}/edit`}
            className="flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10"
        >
            <IconEdit className="h-4 w-4" />
        </Link>
    ) : null;
};

export default EditQuestion;
