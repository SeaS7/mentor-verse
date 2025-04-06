import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import { MentorModel as Mentor } from "@/models/mentor.model";
import MentorStudentMatch from "@/models/connection.model";

export async function GET(req: NextRequest) {
  await dbConnect();

  const searchParams = req.nextUrl.searchParams;
  const expertise = searchParams.get("expertise") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const query: any = {};
  if (expertise) {
    query.expertise = { $regex: expertise, $options: "i" };
  }

  try {
    console.time("mentors-query");

    const total = await Mentor.countDocuments(query);

    const mentors = await Mentor.find(query)
      .populate("user_id", "username email profileImg reputation createdAt")
      .select("expertise availability base_rate bio rating user_id") // ✅ removed heavy 'reviews' from here
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(); // ✅ improves performance by returning plain JS objects

    const mentorIds = mentors.map((m) => m._id);

    // ✅ batch connection count instead of per-mentor loop
    const connectionCounts = await MentorStudentMatch.aggregate([
      {
        $match: {
          $or: [
            { mentorId: { $in: mentorIds } },
            { studentId: { $in: mentorIds } },
          ],
        },
      },
      {
        $group: {
          _id: "$mentorId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = connectionCounts.reduce((acc, cur) => {
      acc[cur._id.toString()] = cur.count;
      return acc;
    }, {} as Record<string, number>);

    const mentorsWithConnections = mentors.map((mentor) => ({
      ...mentor,
      totalConnections: countMap[mentor._id.toString()] || 0,
    }));

    console.timeEnd("mentors-query");

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
