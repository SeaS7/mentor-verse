import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Session from "@/models/session.model";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { studentId, mentorId, date, time } = await request.json();
    console.log("Request Body:", { studentId, mentorId, date, time });


    if (!studentId || !mentorId || !date || !time) {
      return NextResponse.json({ error: "Missing session details" }, { status: 400 });
    }

    // Create a new session
    const newSession = await Session.create({
      mentorId,
      studentId,
      date,
      time,
      sessionLink: [],
    });
console.log("Session Created:", newSession);

    return NextResponse.json({ success: true, session: newSession });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
