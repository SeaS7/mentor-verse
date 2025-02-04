"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mentorId = searchParams.get("mentorId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?._id) {
      setError("");
      setLoading(false);
      return;
    }

    if (!mentorId || !amount) {
      setError("Missing payment details");
      setLoading(false);
      return;
    }

    const savePaymentAndMatch = async () => {
      try {
        const paymentResponse = await axios.post("/api/payment", {
          studentId: session.user._id,
          mentorId,
          amount,
        });

        const paymentId = paymentResponse.data.payment._id;
        console.log("Payment Saved:", paymentId);

        const matchResponse = await axios.post("/api/match", {
          studentId: session.user._id,
          mentorId,
          paymentId: mentorId,
          agreedAmount: amount,
        });

        console.log("Mentor-Student Match Created:", matchResponse.data);
      } catch (err) {
        setError("Error processing payment or creating match");
      } finally {
        setLoading(false);
      }
    };

    savePaymentAndMatch();
  }, [mentorId, session, amount, status]);

  if (loading || status === "loading")
    return (
      <div>
        <div className="relative flex justify-center items-center mt-40">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-black dark:border-white"></div>
          <img
            src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
            className="rounded-full h-28 w-28"
          />
        </div>
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-lg mx-auto text-center mt-28 p-10 border rounded-md shadow-md">
      <h1 className="text-3xl font-bold">Payment Successful</h1>
      <p className="text-gray-600 mt-2">
        Your Connection Has Been Established.
      </p>
      <button
        onClick={() => router.push(`/chat/${mentorId}`)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Start Communication
      </button>
    </div>
  );
}
