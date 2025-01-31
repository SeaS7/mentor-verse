import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import User from "@/models/user.model";
import { MentorModel } from "@/models/mentor.model";

// 📌 **GET Mentor by ID**
export async function GET(
  req: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  await dbConnect();
  console.log(params.mentorId);
  
  try {
    const mentor = await MentorModel.findById(params.mentorId)
      .populate("user_id", "username email profileImg reputation")
      .select("expertise availability base_rate bio");

    if (!mentor) {
      return NextResponse.json(
        { success: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mentor });
  } catch (error) {
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
