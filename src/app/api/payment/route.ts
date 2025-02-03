import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Payment from "@/models/payment.model";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { studentId, mentorId, amount } = await request.json();

    if (!studentId || !mentorId || amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert amount to a number
    const numericAmount = Number(amount);

    // Validate that the conversion worked
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount value" }, { status: 400 });
    }

    console.log("Payment details:", studentId, mentorId, numericAmount);

    const payment = await Payment.create({
      studentId,
      mentorId,
      amount: numericAmount, // Ensure it's stored as a number
      status: "completed",
      transactionId: "123",
    });

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
