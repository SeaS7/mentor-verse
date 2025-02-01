import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Payment from "@/models/payment.model";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { studentId, mentorId, amount} = await request.json();

    if (!studentId || !mentorId || !amount ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payment = await Payment.create({
      studentId,
      mentorId,
      amount,
      status: "completed",
      trasactionId: "",
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
