import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";
import mongoose from "mongoose";

export async function GET(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  await dbConnect();

  const { userId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      { success: false, message: "Invalid user ID" },
      { status: 400 }
    );
  }

  try {

    const questionCount = await Question.countDocuments({ authorId: userId });

    return NextResponse.json({ success: true, total: questionCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching question count:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}