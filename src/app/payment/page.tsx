"use client";

import CheckoutPage from "@/components/checkoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  console.log("session", session?.user._id);
  
  
  // Get mentor object from URL
  const mentorString = searchParams.get("mentor");
  let mentor = null;
  try {
    mentor = mentorString ? JSON.parse(decodeURIComponent(mentorString)) : null;
  } catch (error) {
    console.error("Error parsing mentor object:", error);
  }

  const amount = mentor?.base_rate ? parseFloat(mentor.base_rate) : 0;
  const mentorId = mentor?._id || "";

  if (!mentor || amount <= 0 || !mentorId) {
    return (
      <main className="max-w-6xl mx-auto p-10 text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500 text-white">
        <h2 className="text-2xl font-bold">Invalid payment details.</h2>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <h1 className="text-4xl font-extrabold mb-4">Complete Your Payment</h1>
      <h2 className="text-2xl">
        Pay <span className="font-bold">${amount.toFixed(2)}</span> to {mentor?.user_id?.username}
      </h2>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: Math.round(amount * 100),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} mentorId={mentorId} />
      </Elements>
    </main>
  );
}
