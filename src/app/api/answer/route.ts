import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Answer from "@/models/answer.model";

// Helper function for error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// Create a new answer
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { questionId, content, authorId } = await request.json();

    if (!questionId || !content || !authorId) {
      return createErrorResponse("All fields are required", 400);
    }

    const newAnswer = await Answer.create({
      questionId,
      content,
      authorId,
    });

    return NextResponse.json(
      { success: true, data: newAnswer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding answer:", error);
    return createErrorResponse("Error adding answer", 500);
  }
}

// Delete an answer
export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return createErrorResponse("Answer ID is required", 400);
    }

    const deletedAnswer = await Answer.findByIdAndDelete(id);

    if (!deletedAnswer) {
      return createErrorResponse("Answer not found", 404);
    }

    return NextResponse.json({ success: true, message: "Answer deleted" });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return createErrorResponse("Error deleting answer", 500);
  }
}


export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!questionId) {
      return NextResponse.json(
        { success: false, message: "Question ID is required" },
        { status: 400 }
      );
    }

    const answers = await Answer.find({ questionId })
      .limit(limit)
      .sort({ createdAt: -1 });

      console.log("answers",answers);
    return NextResponse.json(
      { success: true, data: answers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching answers" },
      { status: 500 }
    );
  }
}