"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Link from "next/link";

export const HeroParallax = ({
  header,
}: {
  header: React.ReactNode;
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  return (
    <div className="relative flex flex-col self-auto overflow-hidden py-40 w-full">
      {header}
      <MarqueeDemo />
    </div>
  );
};

const reviews = [
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    name: "Sarah Smith",
    title: "Freelance Web Designer",
    stats: { followers: "2k", likes: "10k", projects: "15" },
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    name: "Jack Wilson",
    title: "Full Stack Developer",
    stats: { followers: "1.5k", likes: "8.5k", projects: "12" },
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    name: "Jill Taylor",
    title: "UI/UX Designer",
    stats: { followers: "3k", likes: "12k", projects: "20" },
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    name: "John Doe",
    title: "Mobile App Developer",
    stats: { followers: "1.8k", likes: "9k", projects: "18" },
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    name: "Jane Foster",
    title: "Content Creator",
    stats: { followers: "2.2k", likes: "11k", projects: "25" },
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    name: "James Brown",
    title: "Digital Marketer",
    stats: { followers: "2.5k", likes: "14k", projects: "30" },
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  title,
  stats,
}: {
  img: string;
  name: string;
  title: string;
  stats: { followers: string; likes: string; projects: string };
}) => {
  return (
    <div className="w-64 h-96 mx-auto bg-transparent rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
      {/* Top Background Image */}
      <div className="rounded-t-lg h-20 overflow-hidden">
        <img
          className="object-cover object-top w-full opacity-80 dark:opacity-60"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Background"
        />
      </div>
      {/* Profile Picture */}
      <div className="mx-auto w-20 h-20 relative -mt-10 border-4 border-white dark:border-gray-700 rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-20"
          src={img}
          alt={name}
        />
      </div>
      {/* Name and Title */}
      <div className="text-center mt-4">
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      </div>
      {/* Stats */}
      <ul className="py-4 mt-4 text-gray-700 dark:text-gray-400 flex items-center justify-around">
        <li className="flex flex-col items-center justify-around">
          <svg
            className="w-4 fill-current text-blue-900 dark:text-emerald-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <div>{stats.followers}</div>
        </li>
        <li className="flex flex-col items-center justify-between">
          <svg
            className="w-4 fill-current text-blue-900 dark:text-emerald-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
          </svg>
          <div>{stats.likes}</div>
        </li>
        <li className="flex flex-col items-center justify-around">
          <svg
            className="w-4 fill-current text-blue-900 dark:text-emerald-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
          </svg>
          <div>{stats.projects}</div>
        </li>
      </ul>
      {/* Follow Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mx-6 mt-2">
        <button className="w-full rounded-full bg-blue-900 hover:bg-blue-800 dark:bg-emerald-400 dark:hover:bg-emerald-500 text-white dark:text-gray-900 font-semibold px-6 py-2">
          Get Mentorship
        </button>
      </div>
    </div>
  );
};




export function MarqueeDemo() {
  return (
    <div className="relative flex h-[1000px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent shadow-none">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-transparent to-transparent"></div>
    </div>
  );
}
