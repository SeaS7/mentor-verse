import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { MentorModel as Mentor } from "@/models/mentor.model";

export async function GET(req: NextRequest) {
  await dbConnect(); // Connect to database

  const searchParams = req.nextUrl.searchParams;
  const expertise = searchParams.get("expertise") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const query: any = {};

  // Search by expertise (case-insensitive, partial match)
  if (expertise) {
    query.expertise = { $regex: expertise, $options: "i" };
  }

  try {
    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .populate("user_id", "username email profileImg reputation createdAt") // Populate mentor's user details
      .populate("reviews.user_id", "username profileImg") // Populate user details inside reviews
      .select("expertise availability base_rate bio rating reviews")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // Newest mentors first

    return NextResponse.json({ success: true, data: mentors, total });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
