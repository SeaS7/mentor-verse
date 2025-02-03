"use client";

import React, { useEffect, useState } from "react";
import { IconBell } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const NotificationBell = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!session?.user?._id) return;

    // Fetch General Notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications?userId=${session.user._id}`);
        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Firestore Listener for Unread Messages
    const messagesRef = collection(db, "chats",session.user._id,"messages");
    const messagesQuery = query(
      messagesRef,
      where("receiverId", "==", session.user._id),
      where("seen", "==", false)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setUnreadMessages(snapshot.docs.length > 0);
    });

    return () => unsubscribe();
  }, [session?.user?._id]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("notification-dropdown");
      const bellButton = document.getElementById("notification-bell");
      if (dropdown && !dropdown.contains(event.target as Node) && !bellButton?.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50"> {/* Ensure bell is above other elements */}
      {/* Notification Bell Button */}
      <button
        id="notification-bell"
        className="relative flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation(); // Prevents closing the dropdown immediately
          setShowDropdown((prev) => !prev);
        }}
      >
        <IconBell className="h-6 w-6 text-gray-800 dark:text-gray-200" />
        
        {/* 🔴 Show red dot if there are unread notifications/messages */}
        {(notifications.length > 0 || unreadMessages) && (
          <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white text-xs"></span>
        )}
      </button>

      {/* 📩 Notifications Dropdown (Visible on Click) */}
      {showDropdown && (
        <div
          id="notification-dropdown"
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 shadow-lg rounded-md z-50 border border-gray-200 dark:border-gray-700"
        >
          <div className="p-4 text-sm font-medium text-gray-800 dark:text-white">
            Notifications
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.id} className="p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                  {notification.message}
                </li>
              ))
            ) : (
              <li className="p-3 text-sm text-gray-500 dark:text-gray-400">
                No new notifications.
              </li>
            )}
            {/* 🔴 Unread Messages Alert */}
            {unreadMessages && (
              <li className="p-3 text-sm text-red-500 dark:text-red-400">
                You have unread messages.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
