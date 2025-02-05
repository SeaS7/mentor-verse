import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import User from "@/models/user.model";
import { MentorModel } from "@/models/mentor.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  await dbConnect();

  try {
    const mentor = await MentorModel.findById(params.mentorId)
      .populate("user_id", "username email profileImg reputation createdAt") // Populate mentor's user details
      .populate("reviews.user_id", "username profileImg") // Populate user details inside reviews
      .select("expertise availability base_rate bio rating reviews");

    if (!mentor) {
      return NextResponse.json(
        { success: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mentor });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// 📌 **PATCH Update Mentor Profile**
export async function PATCH(
  req: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  await dbConnect();
  try {
    const body = await req.json();
    const updatedMentor = await MentorModel.findByIdAndUpdate(
      params.mentorId,
      body,
      { new: true }
    );

    if (!updatedMentor) {
      return NextResponse.json(
        { success: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedMentor });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// 📌 **DELETE Remove Mentor Role**
export async function DELETE(
  req: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  await dbConnect();
  try {
    const mentor = await MentorModel.findByIdAndDelete(params.mentorId);
    if (!mentor) {
      return NextResponse.json(
        { success: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    await User.findByIdAndUpdate(mentor.user_id, { role: "student" });

    return NextResponse.json({ success: true, message: "Mentor role removed" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
