"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function PaymentSuccess() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [delayedCheck, setDelayedCheck] = useState(false); // ✅ Added delay flag

  // ✅ Add a small delay before checking session
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedCheck(true);
    }, 500); // Adjust delay time as needed (500ms is usually good)

    return () => clearTimeout(timer);
  }, []);

  // ✅ Ensure session is fully loaded before fetching query params
  useEffect(() => {
    if (!delayedCheck || status === "loading") return; // ✅ Wait for delay + session to load

    if (status === "unauthenticated" || !session?.user?._id) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const mentor = urlParams.get("mentorId");
    const paymentAmount = urlParams.get("amount");

    if (!mentor || !paymentAmount) {
      setError("Missing payment details");
      setLoading(false);
      return;
    }

    setMentorId(mentor);
    setAmount(paymentAmount);
  }, [status, session, delayedCheck]); // ✅ Only runs after delay + session is ready

  // ✅ Wait for both session and query parameters to be available
  useEffect(() => {
    if (!mentorId || !amount || status !== "authenticated") return;

    const savePaymentAndMatch = async () => {
      try {
        const paymentResponse = await axios.post("/api/payment", {
          studentId: session.user._id,
          mentorId,
          amount,
        });

        const paymentId = paymentResponse.data.payment._id;
        console.log("Payment Saved:", paymentId);

        await axios.post("/api/match", {
          studentId: session.user._id,
          mentorId,
          paymentId,
          agreedAmount: amount,
        });

        console.log("Mentor-Student Match Created!");
      } catch (err) {
        setError("Error processing payment or creating match");
      } finally {
        setLoading(false);
      }
    };

    savePaymentAndMatch();
  }, [mentorId, amount, session?.user?._id, status]); // ✅ Only run when all values exist

  // ✅ Show loading while session or payment processing is still happening
  if (!delayedCheck || status === "loading" || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-500"></div>
      </div>
    );

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-lg mx-auto text-center mt-28 p-10 border rounded-md shadow-md">
      <h1 className="text-3xl font-bold">Payment Successful</h1>
      <p className="text-gray-600 mt-2">Your Connection Has Been Established.</p>
      <button
        onClick={() => router.push(`/chat/${mentorId}`)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Start Communication
      </button>
    </div>
  );
}
