import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Session from "@/models/session.model";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { studentId, mentorId, date, time, sessionLink } = await request.json();
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
      sessionLink,
    });
console.log("Session Created:", newSession);

    return NextResponse.json({ success: true, session: newSession });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract mentorId & studentId from query params
    const { searchParams } = new URL(req.url);
    const mentorId = searchParams.get("mentorId");
    const studentId = searchParams.get("studentId");

    if (!mentorId || !studentId) {
      return NextResponse.json({ success: false, message: "Missing IDs" }, { status: 400 });
    }

    // Fetch sessions from MongoDB
    const sessions = await Session.find({ mentorId, studentId }).sort({ date: 1 });
    console.log("Sessions:", sessions);
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error("❌ Error fetching sessions:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
