"use client";

import { IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const DeleteQuestion = ({ questionId, authorId }: { questionId: string; authorId: string }) => {
    const router = useRouter();
    const { data: session } = useSession();

    const deleteQuestion = async () => {
        try {
            const response = await axios.delete("/api/questions", {
                data: { id: questionId },
            });

            if (response.data.success) {
                router.push("/questions");
            } else {
                window.alert(response.data.message || "Failed to delete the question.");
            }
        } catch (error: any) {
            window.alert(error?.response?.data?.message || "Something went wrong");
        }
    };

    return session?.user?._id === authorId ? (
        <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
            onClick={deleteQuestion}
        >
            <IconTrash className="h-4 w-4" />
        </button>
    ) : null;
};

export default DeleteQuestion;
