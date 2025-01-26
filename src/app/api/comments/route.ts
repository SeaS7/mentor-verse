import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Comment from "@/models/comment.model";

// Helper function to create error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// Create a new comment
export async function POST(request: Request) {
  await dbConnect();

  try {
    const { content, authorId, type, typeId } = await request.json();

    if (!content || !authorId || !type || !typeId) {
      return createErrorResponse("All fields are required", 400);
    }

    const newComment = await Comment.create({
      content,
      authorId,
      type,
      typeId,
    });

    return NextResponse.json(
      { success: true, data: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return createErrorResponse("Error adding comment", 500);
  }
}

// Delete a comment
export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return createErrorResponse("Comment ID is required", 400);
    }

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return createErrorResponse("Comment not found", 404);
    }

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return createErrorResponse("Error deleting comment", 500);
  }
}
