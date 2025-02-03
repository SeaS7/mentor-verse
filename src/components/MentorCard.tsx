import React from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import Link from "next/link";
import Image from "next/image";

const MentorCard = ({ mentor }: { mentor: any }) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      key={mentor._id?.toString()} 
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border bg-white p-4 shadow-md duration-200 hover:shadow-lg sm:flex-row 
            border-gray-200 dark:border-white/20 dark:bg-gray-900 dark:shadow-none dark:hover:shadow-md"
    >
      <BorderBeam size={height} duration={12} delay={9} />
      <div className="border rounded-lg shadow-lg p-5 bg-white dark:bg-gray-900 transition hover:shadow-xl min-w-80">
        <div className="flex items-start space-x-4 justify-start gap-3">
          <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
            <Image
              src={mentor?.user_id?.profileImg || "/default-avatar.png"}
              alt={mentor?.user_id?.username || "Mentor"}
              width={64} // Fixed width
              height={64} // Fixed height
              className="object-cover rounded-full"
            />
          </div>

          <div className="flex-1">
            {/* Mentor Name & Username */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{mentor.user_id?.username || "unknown"}
            </p>
            <p className="text-sm my-2 text-gray-600 dark:text-gray-400 line-clamp-2">
              {mentor.bio || "No bio available"}
            </p>

            <hr className="border-gray-300 dark:border-gray-700 my-2 w-[565px]" />

            {/* Experience Level */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Expertise: {mentor.expertise.join(", ")}
            </p>

            {/* Reputation & Rating */}
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
              <span>⭐ {mentor.rating || "No ratings yet"}</span>
              <span className="text-xs text-gray-400">
                (Reputation: {mentor.user_id?.reputation || 0})
              </span>
            </p>
          </div>
        </div>

        {/* Pricing & Profile Link */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            💰 RS:{mentor.base_rate || 0}/Month
          </p>
          <Link href={`/mentors/${mentor._id}`} className="text-blue-500 dark:text-blue-400 hover:underline">
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
