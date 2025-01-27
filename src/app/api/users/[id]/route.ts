import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import User from "@/models/user.model";
import mongoose from "mongoose";

// Handle GET request
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = await params;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid user ID" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(id).select("username email role profileImg reputation");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
