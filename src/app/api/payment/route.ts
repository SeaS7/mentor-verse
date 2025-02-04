import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConfig";
import Payment from "@/models/payment.model";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { studentId, mentorId, amount } = await request.json();

    // ✅ Check for missing fields
    if (!studentId || !mentorId || amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Convert amount to a number
    const numericAmount = Number(amount);

    // ✅ Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount value" }, { status: 400 });
    }

    // ✅ Convert IDs to MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(mentorId)) {
      return NextResponse.json({ error: "Invalid student or mentor ID" }, { status: 400 });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

    console.log("Payment details:", studentObjectId, mentorObjectId, numericAmount);

    const payment = await Payment.create({
      studentId: studentObjectId,
      mentorId: mentorObjectId,
      amount: numericAmount,
      status: "completed",
      transactionId: studentId + mentorId,
     });

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
