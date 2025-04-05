import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import MentorStudentMatch from "@/models/connection.model";

/**
 * API to check if a student-mentor connection exists.
 * @param {NextRequest} request - The incoming request.
 * @returns {NextResponse} - JSON response with the connection status.
 */
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const mentorId = searchParams.get("mentorId");
    console.log("studentId", studentId);
    console.log("mentorId", mentorId);

    if (!studentId || !mentorId) {
      return NextResponse.json(
        { success: false, message: "Missing studentId or mentorId" },
        { status: 400 }
      );
    }

    const existingConnection = await MentorStudentMatch.findOne({
      studentId,
      mentorId,
    });
    if (existingConnection) {
      return NextResponse.json(
        { success: true, exists: true, message: "Connection already exists" },
        { status: 200 }
      );
    }
    console.log("No connection found");
    return NextResponse.json(
      { success: true, exists: false, message: "No connection found" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error checking connection:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
