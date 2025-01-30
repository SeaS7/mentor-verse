import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = await context.params;

    if (!id || id.length !== 24) {
      return NextResponse.json({ success: false, message: "Invalid question ID" }, { status: 400 });
    }

    const question = await Question.findById(id)
      .populate("authorId", "username profileImg")
      .lean();

    if (!question) {
      return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: question }, { status: 200 });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ success: false, message: "Error fetching question" }, { status: 500 });
  }
}
