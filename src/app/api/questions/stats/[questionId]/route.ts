import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Vote from "@/models/vote.model";
import Answer from "@/models/answer.model";
import mongoose from "mongoose";

// Handle GET request
export async function GET(request: NextRequest, { params }: { params: { questionId: string } }) {
  await dbConnect();

  const { questionId } = await params;

  // Validate question ID
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return NextResponse.json(
      { success: false, message: "Invalid question ID" },
      { status: 400 }
    );
  }

  try {
    const totalVotes = await Vote.countDocuments({ type: "question", typeId: questionId });
    const totalAnswers = await Answer.countDocuments({ questionId });

    return NextResponse.json(
      {
        success: true,
        data: {
          totalVotes,
          totalAnswers,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
