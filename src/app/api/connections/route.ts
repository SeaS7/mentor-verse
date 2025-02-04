import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import MentorStudentMatch from "@/models/connection.model";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Fetch all mentor-student matches and populate user details
    const connections = await MentorStudentMatch.find()
      .populate("studentId", "username email profileImg reputation")
      .populate("mentorId", "username email profileImg reputation");
    console.log("connections", connections);
    return NextResponse.json({ success: true, data: connections });
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
