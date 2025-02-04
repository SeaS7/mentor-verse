"use client";

import CheckoutPage from "@/components/checkoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession(); // Get session status
  const router = useRouter();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if(status === "loading") return
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show a loading message while checking authentication
  if (status === "loading") {
    return (
      <main className="h-screen flex items-center justify-center text-xl font-bold">
        Checking authentication...
      </main>
    );
  }

  if (!session?.user) {
    return null; // Prevent rendering if user is being redirected
  }

  // Get mentor object from URL
  const mentorString = searchParams.get("mentor");
  let mentor = null;

  try {
    mentor = mentorString ? JSON.parse(decodeURIComponent(mentorString)) : null;
  } catch (error) {
    console.error("Error parsing mentor object:", error);
    toast({
      title: "Invalid Mentor Data",
      description: "There was an error processing mentor information.",
      variant: "destructive",
    });
  }

  const conversionRate = 0.0035; // Update this rate if needed
  const baseRateUSD = mentor?.base_rate ? (mentor.base_rate * conversionRate).toFixed(2) : "0.00";
  const amount = baseRateUSD ? parseFloat(baseRateUSD) : 0;
  const mentorId = mentor?.user_id?._id || "";

  if (!mentor || amount <= 0 || !mentorId) {
    toast({
      title: "Payment Error",
      description: "Invalid payment details. Please try again.",
      variant: "destructive",
    });

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
