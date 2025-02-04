"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // Import session
import React from "react";

const Navbar = () => {
  const { userId, userSlug } = useParams();
  const pathname = usePathname();
  const { data: session } = useSession(); // Get session

  // ✅ Define items with proper type and filter invalid values
  const items: { name: string; href: string }[] = [
    {
      name: "Summary",
      href: `/users/${userId}/${userSlug}`,
    },
   
    ...(session?.user?._id === userId
      ? [
          {
            name: "Connections",
            href: `/users/${userId}/${userSlug}/connections`,
          },
        ]
      : []),
    {
      name: "Questions",
      href: `/users/${userId}/${userSlug}/questions`,
    },
    {
      name: "Answers",
      href: `/users/${userId}/${userSlug}/answers`,
    },
    {
      name: "Votes",
      href: `/users/${userId}/${userSlug}/votes`,
    },
  ];

  return (
    <ul className="flex w-64 shrink-0 gap-1 overflow-auto sm:w-40 sm:flex-col">
      {items.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
              pathname === item.href ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
