"use client";

import CheckoutPage from "@/components/checkoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [mentorId, setMentorId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const mentorString = urlParams.get("mentor");

      if (mentorString) {
        try {
          const parsedMentor = JSON.parse(decodeURIComponent(mentorString));
          setMentor(parsedMentor);

          const conversionRate = 0.0035; // Update if needed
          const baseRateUSD = parsedMentor?.base_rate
            ? (parsedMentor.base_rate * conversionRate).toFixed(2)
            : "0.00";

          setAmount(parseFloat(baseRateUSD));
          setMentorId(parsedMentor?.user_id?._id || "");
        } catch (error) {
          console.error("Error parsing mentor object:", error);
          toast({
            title: "Invalid Mentor Data",
            description: "There was an error processing mentor information.",
            variant: "destructive",
          });
        }
      }
    }
  }, []);
  useEffect(() => {
    if (status === "loading") return;
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="h-screen flex items-center justify-center text-xl font-bold">
        Checking authentication...
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

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
        Pay <span className="font-bold">${amount.toFixed(2)}</span> to{" "}
        {mentor?.user_id?.username}
      </h2>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: Math.round(amount * 100),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} mentorId={mentorId} userId={session.user._id} />
      </Elements>
    </main>
  );
}
