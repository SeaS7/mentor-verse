import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import MentorStudentMatch from "@/models/connection.model";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { studentId, mentorId, paymentId, agreedAmount } = await request.json();

    if (!studentId || !mentorId || !paymentId || !agreedAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if a match already exists to prevent duplicates
    const existingMatch = await MentorStudentMatch.findOne({ studentId, mentorId });

    if (existingMatch) {
      return NextResponse.json({ error: "Mentor-Student match already exists" }, { status: 400 });
    }

    const newMatch = await MentorStudentMatch.create({
      studentId,
      mentorId,
      paymentId,
      agreedAmount,
      isPaid: true, // Since payment is confirmed
    });

    return NextResponse.json({ success: true, match: newMatch });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
