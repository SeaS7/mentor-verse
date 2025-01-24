import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";

// Helper function for error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// Create Question (POST)
export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const authorId = formData.get("authorId") as string;
    const tags = JSON.parse(formData.get("tags") as string);
    const attachmentId = formData.get("attachmentId") as string;
    console.log("attachmentId", attachmentId);
    

    if (!title || !content || !authorId) {
      return createErrorResponse("Title, content, and authorId are required");
    }

    const newQuestion = await Question.create({
      title,
      content,
      authorId,
      tags,
      attachmentId : attachmentId || '',
    });
    console.log("newQuestion", newQuestion);
    

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
    const formData = await request.formData();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = JSON.parse(formData.get("tags") as string);
    const attachmentId = formData.get("attachmentId") as string;

    if (!id) {
      return createErrorResponse("Question ID is required");
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { title, content, tags, attachmentId },
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
    const formData = await request.formData();
    const id = formData.get("id") as string;

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
