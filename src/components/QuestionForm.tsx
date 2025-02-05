"use client";

import RTE from "@/components/RTE";
import Meteors from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "./ui/use-toast";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border bg-gray-100 p-4 text-gray-900 dark:border-white/20 dark:bg-slate-950 dark:text-white",
        className
      )}
    >
      <Meteors number={30} />
      {children}
    </div>
  );
};

const QuestionForm = ({ question }: { question?: any }) => {
  const [tag, setTag] = React.useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const [formData, setFormData] = React.useState({
    title: question?.title || "",
    content: question?.content || "",
    authorId: session?.user._id,
    tags: new Set<string>(question?.tags || []),
    attachment: null as File | null,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const addTag = () => {
    if (!tag.trim()) return;

    // Format tag: lowercase & replace spaces with hyphens
    const formattedTag = tag.trim().toLowerCase().replace(/\s+/g, "-");

    setFormData((prev) => ({
      ...prev,
      tags: new Set([...prev.tags, formattedTag]), // Ensure unique tags
    }));

    setTag(""); // Clear input after adding
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.authorId) {
      if (!session) {
        toast({
          title: "Error",
          description: "Please login before submitting a question.",
          variant: "destructive",
        });

        router.push("/login");
        return;
      }
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      setError("Please fill out all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = question
        ? await axios.put("/api/questions", {
            id: question._id,
            title: formData.title,
            content: formData.content,
            tags: Array.from(formData.tags),
            attachment: formData.attachment,
          })
        : await axios.post("/api/questions", {
            title: formData.title,
            content: formData.content,
            authorId: session?.user._id,
            tags: Array.from(formData.tags),
            attachment: formData.attachment,
          });

    

      router.push(`/questions/${response.data.data._id}/${slugify(formData.title)}`);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error submitting question");
    }

    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {error && (
        <LabelInputContainer>
          <div className="text-center">
            <span className="text-red-500">{error}</span>
          </div>
        </LabelInputContainer>
      )}

      <LabelInputContainer>
        <Label htmlFor="title">
          Title
          <br />
          <small>Be specific and imagine you're asking another person.</small>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. How to use React hooks?"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="content">
          Details of your problem
          <br />
          <small>Provide as much detail as possible. Minimum 20 characters.</small>
        </Label>
        <div className="relative min-h-[200px] rounded-lg border bg-gray-100 p-4 text-gray-900 dark:border-white/20 dark:bg-slate-900 dark:text-white">
          <RTE
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value || "" }))
            }
          />
        </div>
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          name="image"
          accept="image/*"
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            setFormData((prev) => ({
              ...prev,
              attachment: files[0],
            }));
          }}
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="tag">Tags</Label>
        <div className="flex w-full gap-4">
          <Input
            id="tag"
            name="tag"
            placeholder="e.g. react, nodejs"
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <button
            className="bg-gray-200 px-4 py-2 rounded-md dark:bg-gray-700"
            type="button"
            onClick={addTag}
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from(formData.tags).map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    tags: new Set(
                      Array.from(prev.tags).filter((t) => t !== tag)
                    ),
                  }));
                }}
              >
                <IconX size={12} />
              </button>
            </div>
          ))}
        </div>
      </LabelInputContainer>

      <button
        className="w-full bg-blue-600 text-white p-3 rounded-md"
        type="submit"
        disabled={loading}
      >
        {loading ? "Submitting..." : question ? "Update" : "Publish"}
      </button>
    </form>
  );
};

export default QuestionForm;
