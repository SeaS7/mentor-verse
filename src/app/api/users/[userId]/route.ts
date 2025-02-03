import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import User from "@/models/user.model";
import mongoose from "mongoose";

// Handle GET request
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  await dbConnect();

  const { userId } = await params;
  console.log(  "userId",userId);
  

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      { success: false, message: "Invalid user ID" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId).select("username email role profileImg reputation createdAt updatedAt");
    console.log("user",user);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
