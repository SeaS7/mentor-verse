import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { MentorModel as Mentor } from "@/models/mentor.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect(); // Ensure database connection

  const { userId } = params; // Extract userId from URL params

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // ✅ Find the mentor using `userId`
    const mentor = await Mentor.findOne({ user_id: userId })
      .populate("user_id", "username email profileImg reputation createdAt") // Fetch user details
      .populate("reviews.user_id", "username profileImg") // Fetch user details inside reviews
      .select("-__v"); // Exclude `__v` field

    if (!mentor) {
      return NextResponse.json(
        { success: false, message: "Mentor not found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mentor });
  } catch (error) {
    console.error("❌ Error fetching mentor:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch mentor details" },
      { status: 500 }
    );
  }
}
