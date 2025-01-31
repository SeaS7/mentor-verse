"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import convertDateToRelativeTime from "@/utils/relativeTime";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"; 

// Define Mentor Interface
interface Mentor {
  user_id: {
    profileImg?: string;
    username: string;
    createdAt: string;
  };
  bio: string;
  availability: string;
  expertise: string[];
  base_rate: number;
}

const MentorProfile = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`/api/mentors/${mentorId}`);
        setMentor(response.data.data);
      } catch (error) {
        console.error("Error fetching mentor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  // Loading State (Skeleton UI)
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-6">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="w-3/4 h-6 bg-gray-300 animate-pulse rounded"></div>
        <div className="w-2/4 h-4 bg-gray-300 animate-pulse rounded"></div>
      </div>
    );
  }

  // Error State
  if (!mentor) {
    return <p className="text-center text-red-500">Mentor not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 pb-20 pt-10 flex justify-center">
      <CardContainer className="inter-var shadow-lg dark:shadow-2xl dark:bg-black dark:border-white/[0.2] border-black/[0.1]">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl py-6 px-10  border  ">
       
       <CardItem translateZ={50}>
       <div className="rounded-t-lg h-20 overflow-hidden">
        <img
          className="object-cover object-top w-full opacity-80 dark:opacity-60"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Background"
        />
      </div>
      {/* Profile Picture */}
      <div className="mx-auto w-20 h-20 relative -mt-10 border-1 border-white dark:border-gray-700  overflow-hidden">
        <Image
              src={mentor?.user_id?.profileImg || "/default-avatar.png"}
              alt={mentor?.user_id?.username || "Mentor"}
              className="rounded-full object-cover"
              width={100}
              height={100}
            />
      </div>
       </CardItem>
         {/* Profile Image */}
         

          {/* Mentor Details */}
          <CardItem translateZ={30} className="text-center">
            <h1 className="text-2xl font-bold">{mentor?.user_id?.username}</h1>
            <p className="text-sm text-gray-400">
              {mentor.bio || "No bio available."}
            </p>
          </CardItem>

          {/* Additional Info */}
          <CardItem translateZ={20} className="flex flex-col items-center mt-3">
            <p className="flex items-center gap-1 text-xs font-bold text-gray-300">
              <IconUserFilled className="w-4 shrink-0" /> Joined{" "}
              {mentor?.user_id?.createdAt
                ? convertDateToRelativeTime(new Date(mentor.user_id.createdAt))
                : "N/A"}
            </p>
            <p className="flex items-center gap-1 text-xs text-gray-300">
              <IconClockFilled className="w-4 shrink-0" /> Availability:{" "}
              {mentor.availability || "Not specified"}
            </p>
          </CardItem>

          {/* Expertise */}
          <CardItem translateZ={10} className="mt-4">
            <p className="text-sm font-semibold">
              Expertise:{" "}
              {mentor.expertise.length > 0
                ? mentor.expertise.join(", ")
                : "No expertise listed."}
            </p>
          </CardItem>

          {/* Pricing */}
          <CardItem translateZ={20} className="text-green-400 mt-3 text-lg font-semibold">
            Base Rate: ${mentor.base_rate || "N/A"}/month
          </CardItem>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <CardItem translateZ={5}>
              <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                Save
              </button>
            </CardItem>
            <CardItem translateZ={5}>
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Apply Now
              </button>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default MentorProfile;
