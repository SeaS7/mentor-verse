import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";

// Helper function for error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;

    if (!id) {
      return createErrorResponse("Question ID is required", 400);
    }

    const question = await Question.findById(id).populate("authorId", "username profileImg");

    if (!question) {
      return createErrorResponse("Question not found", 404);
    }

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    console.error("Error fetching question:", error);
    return createErrorResponse("Error fetching question", 500);
  }
}
