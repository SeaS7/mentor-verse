import React from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import Link from "next/link";
import slugify from "@/utils/slugify";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { getUserAndQuestionStats } from "@/utils/questionStats";

const QuestionCard = ({ ques }: { ques: any }) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  // const [stats, setStats] = React.useState<any>(null);
  // const [loading, setLoading] = React.useState<boolean>(true);

  // React.useEffect(() => {
  //   // Fetch user and question stats
  //   const fetchStats = async () => {
  //     try {
  //       const result = await getUserAndQuestionStats(ques.authorId, ques._id);
  //       setStats(result);
  //     } catch (error) {
  //       console.error("Error fetching stats:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStats();
  // }, [ques.authorId, ques._id]);

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border bg-white p-4 shadow-md duration-200 hover:shadow-lg sm:flex-row 
            border-gray-200 dark:border-white/20 dark:bg-gray-900 dark:shadow-none dark:hover:shadow-md"
    >
      <BorderBeam size={height} duration={12} delay={9} />
      <div className="relative shrink-0 text-sm sm:text-right">
        {/* Render stats only if data is loaded */}
            <p>{ques.result.questionStats.totalVotes} votes</p>
            <p>{ques.result.questionStats.totalAnswers} answers</p>
      </div>
      <div className="relative w-full">
        <Link
          href={`/questions/${ques._id}/${slugify(ques.title)}`}
          className="text-orange-500 duration-200 hover:text-orange-600"
        >
          <h2 className="text-xl font-semibold">{ques.title}</h2>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {ques.tags?.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-lg bg-gray-100 px-2 py-0.5 duration-200 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20"
            >
              #{tag}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <Link
              href={`/users/${ques.authorId}/${slugify(ques.result?.user?.username || "")}`}
              className="text-orange-500 hover:text-orange-600"
            >
              {ques.result?.user?.username || "Loading..."}
            </Link>
            <strong>
              &quot;{ques.result?.user?.reputation ?? "N/A"}&quot;
            </strong>
          </div>
          <span>
            asked {convertDateToRelativeTime(new Date(ques.createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
