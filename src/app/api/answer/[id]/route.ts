import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Answer from "@/models/answer.model";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json({ success: false, message: "Question ID is required" }, { status: 400 });
    }

    const answers = await Answer.find({ questionId }).populate("authorId", "username profileImg");

    return NextResponse.json({ success: true, data: answers });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json({ success: false, message: "Error fetching answers" }, { status: 500 });
  }
}
