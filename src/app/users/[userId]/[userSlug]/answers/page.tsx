import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: { userId: string; userSlug: string };
    searchParams: { page?: string };
}) => {
    searchParams.page ||= "1";

    const queries = [
        Query.equal("authorId", params.userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+searchParams.page - 1) * 25),
        Query.limit(25),
    ];

    let answers;
    try {
        answers = await databases.listDocuments(db, answerCollection, queries);

        // Fetch related questions
        answers.documents = await Promise.all(
            answers.documents.map(async (ans) => {
                try {
                    const question = await databases.getDocument(
                        db,
                        questionCollection,
                        ans.questionId,
                        [Query.select(["title"])]
                    );
                    return { ...ans, question };
                } catch (error) {
                    console.error(`Failed to fetch question for answer ${ans.$id}:`, error);
                    return { ...ans, question: null };
                }
            })
        );
    } catch (error) {
        console.error("Error fetching answers:", error);
        return (
            <div className="px-4">
                <p className="text-red-500">Failed to load answers. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-6">
            <div className="mb-4">
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {answers.total} {answers.total === 1 ? "answer" : "answers"}
                </p>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {answers.documents.map((ans) => (
                    <div
                        key={ans.$id}
                        className="rounded-lg border border-gray-300 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="max-h-40 overflow-auto">
                            <MarkdownPreview
                                source={ans.content}
                            />
                        </div>
                        {ans.question ? (
                            <Link
                                href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                                className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                            >
                                View Question
                            </Link>
                        ) : (
                            <p className="mt-3 text-sm text-red-500">
                                Question data unavailable.
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <Pagination total={answers.total} limit={25} />
        </div>
    );
};

export default Page;
