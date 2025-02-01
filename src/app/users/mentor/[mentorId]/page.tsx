"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import convertDateToRelativeTime from "@/utils/relativeTime";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

// Define Mentor Interface
interface Mentor {
  user_id: {
    profileImg?: string;
    username: string;
    createdAt: string;
    reputation: number;
  };
  bio: string;
  availability: string;
  expertise: string[];
  base_rate: number;
  rating: number;
}

const MentorProfile = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "/default-avatar.png",
    },
  ];
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
    <div>
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={500}
        ease={400}
        color={color}
        refresh
      />
      <div className="container mx-auto px-4 pb-20 flex justify-center items-center">
        <div className="w-1/2 ml-4 flex flex-col items-center justify-center gap-4">
          <CardContainer className="inter-var shadow-lg dark:shadow-2xl dark:bg-black dark:border-white/[0.2] border-black/[0.1]">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl py-4 px-4  border  ">
              <CardItem translateZ={50}>
                <div className="rounded-t-lg h-32 overflow-hidden">
                  <img
                    className="object-cover object-top w-full opacity-80 "
                    src="https://images.unsplash.com/photo-1610528816441-f309483d887a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwOHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Background"
                  />
                </div>
                {/* Profile Picture */}
                <div className="mx-auto w-20 h-20 relative -mt-10 border-1 border-white dark:border-gray-700  overflow-hidden">
                  <Image
                    src={mentor?.user_id?.profileImg || "/default-avatar.png"}
                    alt={mentor?.user_id?.username || "Mentor"}
                    className="rounded-full object-cover"
                    width={120}
                    height={120}
                  />
                </div>
              </CardItem>

              {/* Mentor Details */}
              <CardItem translateZ={30}>
                <h1 className="text-2xl font-bold">
                  {mentor?.user_id?.username}
                </h1>
                <p className="text-sm text-gray-400">
                  {mentor.bio || "No bio available."}
                </p>
              </CardItem>

              {/* Additional Info */}
              <CardItem
                translateZ={20}
                className="flex flex-col items-center mt-3"
              >
                <p className="flex items-center gap-1 text-xs font-bold text-gray-300">
                  <IconUserFilled className="w-4 shrink-0" /> Joined{" "}
                  {mentor?.user_id?.createdAt
                    ? convertDateToRelativeTime(
                        new Date(mentor.user_id.createdAt)
                      )
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
              <CardItem
                translateZ={20}
                className="text-green-400 mt-3 text-lg font-semibold"
              >
                Base Rate: ${mentor.base_rate || "N/A"}/month
              </CardItem>

              <CardItem
                translateZ={20}
                className="text-sm text-gray-300 mt-1 flex items-center gap-1"
              >
                reputation: {mentor.user_id?.reputation || "N/A"}
              </CardItem>
              {/* Rating */}
              <CardItem
                translateZ={20}
                className="text-sm text-gray-300 mt-1 flex items-center gap-1"
              >
                Rating: {mentor.rating || "N/A"}
                {mentor.rating && (
                  <div className="flex items-center ml-2">
                    {Array.from({ length: 5 }, (_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < mentor.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.912c.969 0 1.372 1.24.588 1.81l-3.97 2.946a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.97-2.946a1 1 0 00-1.176 0l-3.97 2.946c-.784.57-1.838-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.002 10.1c-.784-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.518-4.674z" />
                      </svg>
                    ))}
                  </div>
                )}
              </CardItem>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between">
                <CardItem
                  translateZ={20}
                  href="https://twitter.com/mannupaaji"
                  target="__blank"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Try now →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  onClick={() => {
                    const mentorData = encodeURIComponent(
                      JSON.stringify(mentor)
                    ); // Encode mentor object
                    router.push(`/payment?mentor=${mentorData}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Start MentorShip
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div>
        <div className="w-1/2 ml-4 flex flex-col items-center justify-center gap-4">
          <AnimatedTestimonials testimonials={testimonials} />
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
