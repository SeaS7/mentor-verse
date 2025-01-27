import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";

// Helper function for error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// Create Question (POST)
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { title, content, authorId, tags, attachment } = await request.json();

    if (!title || !content || !authorId) {
      return createErrorResponse("Title, content, and authorId are required");
    }

    const newQuestion = await Question.create({
      title,
      content,
      authorId,
      tags,
      attachmentId: attachment || "",
    });

    return NextResponse.json({ success: true, data: newQuestion }, { status: 201 });
  } catch (error) {
    console.error("Error adding question:", error);
    return createErrorResponse("Error adding question", 500);
  }
}

// Update Question (PUT)
export async function PUT(request: NextRequest) {
  await dbConnect();

  try {
    const { id, title, content, tags, attachment } = await request.json();

    if (!id) {
      return createErrorResponse("Question ID is required");
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { title, content, tags, attachmentId: attachment || "" },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return createErrorResponse("Question not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return createErrorResponse("Error updating question", 500);
  }
}

// Delete Question (DELETE)
export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    const { id } = await request.json();

    if (!id) {
      return createErrorResponse("Question ID is required");
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return createErrorResponse("Question not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return createErrorResponse("Error deleting question", 500);
  }
}



export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string, 10) : 15;

    const query: any = {};
    if (questionId) {
      query._id = questionId;
    }

    const questions = await Question.find(query).limit(limit);
    console.log("questions", questions);


    if (!questions.length) {
      return createErrorResponse("No questions found", 404);
    }

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return createErrorResponse("Error fetching questions", 500);
  }
}