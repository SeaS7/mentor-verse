"use client";

import React, { useEffect, useState } from "react";
import { Marquee } from "@/components/ui/marquee";
import axios from "axios";
import Link from "next/link";

// Skeleton Loader Component
const MentorCardSkeleton = () => {
  return (
    <div className="w-64 h-auto mx-auto bg-transparent rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
      {/* Top Background Skeleton */}
      <div className="rounded-t-lg h-20 bg-gray-300 animate-pulse"></div>
      {/* Profile Picture Skeleton */}
      <div className="mx-auto w-20 h-20 relative -mt-10 border-4 border-white dark:border-gray-700 rounded-full overflow-hidden bg-gray-300 animate-pulse"></div>
      {/* Name and Title Skeleton */}
      <div className="text-center mt-4">
        <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse mx-auto"></div>
        <div className="w-40 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse mx-auto mt-2"></div>
      </div>
      {/* Expertise Skeleton */}
      <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse mx-auto mt-2"></div>
      {/* Stats Skeleton */}
      <ul className="py-4 mt-4 text-gray-700 dark:text-gray-400 flex items-center justify-around">
        <li className="flex flex-col items-center">
          <div className="w-10 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        </li>
        <li className="flex flex-col items-center">
          <div className="w-10 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        </li>
        <li className="flex flex-col items-center">
          <div className="w-10 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        </li>
      </ul>
      {/* Get Mentorship Button Skeleton */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mx-6 mt-2">
        <div className="w-full h-10 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export const HeroParallax = ({ header }: { header: React.ReactNode }) => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    let isMounted = true; // for cleanup
    const fetchMentors = async () => {
      let attempts = 0;
      const maxRetries = 3;

      while (attempts < maxRetries) {
        try {
          const response = await axios.get("/api/mentors?page=1&limit=10", {
            timeout: 10000, // 10 seconds timeout
          });
          if (isMounted) {
            setMentors(response.data.data);
            setLoading(false);
          }
          break; // success, exit loop
        } catch (err) {
          attempts++;
          console.error(`Attempt ${attempts} failed:`, err);
          if (attempts === maxRetries && isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchMentors();

    return () => {
      isMounted = false;
    };

    fetchMentors();
  }, []);

  const firstRow = mentors.slice(0, mentors.length / 2);
  const secondRow = mentors.slice(mentors.length / 2);

  return (
    <div className="relative flex flex-col self-auto overflow-hidden py-40 w-full">
      {header}
      {/* Marquee for first row */}
      <MarqueeDemo
        mentors={loading ? Array(5).fill(null) : firstRow}
        reverse={false}
      />
      {/* Marquee for second row */}
      <MarqueeDemo
        mentors={loading ? Array(5).fill(null) : secondRow}
        reverse={true}
      />
    </div>
  );
};

const MentorCard = ({
  profileImg,
  id,
  username,
  bio,
  expertise,
  rating,
  reputation,
  connections,
}: {
  profileImg: string;
  username: string;
  id: string;
  bio: string;
  expertise: string[];
  rating: number;
  reputation: number;
  connections: number;
}) => {
  return (
    <div className="w-64 h-auto mx-auto bg-transparent rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
      {/* Top Background Image */}
      <div className="rounded-t-lg h-20 overflow-hidden">
        <img
          className="object-cover object-top w-full opacity-80 dark:opacity-60"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max"
          alt="Background"
        />
      </div>
      {/* Profile Picture */}
      <div className="mx-auto w-20 h-20 relative -mt-10 border-white dark:border-gray-700 rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-20"
          src={profileImg || "/default-avatar.png"}
          alt={username}
        />
      </div>
      {/* Name and Title */}
      <div className="text-center mt-4">
        <h2 className="font-semibold text-lg">{username}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm h-8">
          {bio.length > 50
            ? bio.slice(0, 50) + "..."
            : bio || "No bio available"}
        </p>
      </div>
      {/* Expertise */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 h-4 overflow-hidden">
        Expertise: {expertise.join(", ")}
      </p>
      {/* Stats */}
      <ul className="py-4 mt-4 text-gray-700 dark:text-gray-400 flex items-center justify-around">
        <li className="flex flex-col items-center">
          ⭐ <div>{rating || "None"}</div>
        </li>
        <li className="flex flex-col items-center">
          💰 <div>{connections} </div>
        </li>
        <li className="flex flex-col items-center">
          🏆 <div>{reputation}</div>
        </li>
      </ul>
      {/* Get Mentorship Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mx-6 mt-2">
        <Link href={`/mentors/${id}`} passHref>
          <button className="w-full rounded-full bg-transparent border border-gray-500 dark:border-gray-400 text-gray-900 dark:text-gray-100 font-semibold px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            Get Mentorship
          </button>
        </Link>
      </div>
    </div>
  );
};

export function MarqueeDemo({
  mentors,
  reverse,
}: {
  mentors: any[];
  reverse: boolean;
}) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent shadow-none">
      <Marquee pauseOnHover reverse={reverse} className="[--duration:20s]">
        {mentors.map((mentor, idx) => {
          return mentor ? (
            <MentorCard
              id={mentor._id}
              key={mentor._id}
              profileImg={mentor?.user_id?.profileImg || "/default-avatar.png"}
              username={mentor?.user_id?.username || "Unknown"}
              bio={mentor.bio || "No bio available"}
              expertise={mentor.expertise || []}
              rating={mentor.rating || 0}
              reputation={mentor?.user_id?.reputation || 0}
              connections={mentor.base_rate || 0}
            />
          ) : (
            <MentorCardSkeleton key={idx} />
          );
        })}
      </Marquee>
    </div>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { Marquee } from "@/components/ui/marquee";
// import axios from "axios";
// import Link from "next/link";
// import { Key } from "lucide-react";

// export const HeroParallax = ({ header }: { header: React.ReactNode }) => {
//   const [mentors, setMentors] = useState([]);

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         const response = await axios.get("/api/mentors?page=1&limit=10");
//         setMentors(response.data.data);
//       } catch (error) {
//         console.error("Error fetching mentors:", error);
//       }
//     };

//     fetchMentors();
//   }, []);

//   const firstRow = mentors.slice(0, mentors.length / 2);
//   const secondRow = mentors.slice(mentors.length / 2);

//   return (
//     <div className="relative flex flex-col self-auto overflow-hidden py-40 w-full">
//       {header}
//       <MarqueeDemo mentors={firstRow} reverse={false} />
//       <MarqueeDemo mentors={secondRow} reverse={true} />
//     </div>
//   );
// };

// const MentorCard = ({
//   profileImg,
//   id,
//   username,
//   bio,
//   expertise,
//   rating,
//   reputation,
//   connections,
// }: {
//   profileImg: string;
//   username: string;
//   id: string;
//   bio: string;
//   expertise: string[];
//   rating: number;
//   reputation: number;
//   connections: number;
// }) => {
//   return (
//     <div className="w-64 h-auto mx-auto bg-transparent rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
//       {/* Top Background Image */}
//       <div className="rounded-t-lg h-20 overflow-hidden">
//         <img
//           className="object-cover object-top w-full opacity-80 dark:opacity-60"
//           src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max"
//           alt="Background"
//         />
//       </div>
//       {/* Profile Picture */}
//       <div className="mx-auto w-20 h-20 relative -mt-10 border-4 border-white dark:border-gray-700 rounded-full overflow-hidden">
//         <img
//           className="object-cover object-center h-20"
//           src={profileImg || "/default-avatar.png"}
//           alt={username}
//         />
//       </div>
//       {/* Name and Title */}
//       <div className="text-center mt-4">
//         <h2 className="font-semibold text-lg">{username}</h2>
//         <p className="text-gray-500 dark:text-gray-400 text-sm h-8">
//           {bio.length > 50
//             ? bio.slice(0, 50) + "..."
//             : bio || "No bio available"}
//         </p>
//       </div>
//       {/* Expertise */}
//       <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
//         Expertise: {expertise.join(", ")}
//       </p>
//       {/* Stats */}
//       <ul className="py-4 mt-4 text-gray-700 dark:text-gray-400 flex items-center justify-around">
//         <li className="flex flex-col items-center">
//           ⭐ <div>{rating || "None"}</div>
//         </li>
//         <li className="flex flex-col items-center">
//           🤝 <div>{connections} </div>
//         </li>
//         <li className="flex flex-col items-center">
//           🏆 <div>{reputation}</div>
//         </li>
//       </ul>
//       {/* Get Mentorship Button */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-800 mx-6 mt-2">
//         <Link href={`/mentors/${id}`} passHref>
//           <button className="w-full rounded-full bg-transparent border border-gray-500 dark:border-gray-400 text-gray-900 dark:text-gray-100 font-semibold px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
//             Get Mentorship
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export function MarqueeDemo({
//   mentors,
//   reverse,
// }: {
//   mentors: any[];
//   reverse: boolean;
// }) {
//   return (
//     <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent shadow-none ">
//       <Marquee pauseOnHover reverse={reverse} className="[--duration:20s]">
//         {mentors.map((mentor) => (
//           <MentorCard
//             id={mentor._id}
//             key={mentor._id}
//             profileImg={mentor?.user_id?.profileImg || "/default-avatar.png"}
//             username={mentor?.user_id?.username || "Unknown"}
//             bio={mentor.bio || "No bio available"}
//             expertise={mentor.expertise || []}
//             rating={mentor.rating || 0}
//             reputation={mentor?.user_id?.reputation || 0}
//             connections={mentor.connections || 0}
//           />
//         ))}
//       </Marquee>
//     </div>
//   );
// }
