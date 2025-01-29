import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;

    // Fetch the question along with the author's username and profileImg
    const question = await Question.findById(id)
      .populate("authorId", "username profileImg") // Populate username and profileImg from User model
      .lean();

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: question }, { status: 200 });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching question" },
      { status: 500 }
    );
  }
}
