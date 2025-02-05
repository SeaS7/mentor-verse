import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { MentorModel as Mentor } from "@/models/mentor.model";
import MentorStudentMatch from "@/models/connection.model";

export async function GET(req: NextRequest) {
  await dbConnect(); // Connect to database

  const searchParams = req.nextUrl.searchParams;
  const expertise = searchParams.get("expertise") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const query: any = {};

  // ✅ Search by expertise (case-insensitive, partial match)
  if (expertise) {
    query.expertise = { $regex: expertise, $options: "i" };
  }

  try {
    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .populate("user_id", "username email profileImg reputation createdAt") // ✅ Mentor's user details
      .populate("reviews.user_id", "username profileImg") // ✅ Reviews user details
      .select("expertise availability base_rate bio rating reviews user_id")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const mentorsWithConnections = await Promise.all(
      mentors.map(async (mentor) => {
        const totalConnections = await MentorStudentMatch.countDocuments({
          $or: [{ mentorId: mentor._id }, { studentId: mentor._id }],
        });

        return {
          ...mentor.toObject(),
          totalConnections,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: mentorsWithConnections,
      total,
    });
  } catch (error) {
    console.error("❌ Error fetching mentors:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
