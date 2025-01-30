import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Answer from "@/models/answer.model";
import Question from "@/models/question.model";
import User from "@/models/user.model";
import Notification from "@/models/notification.model";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { questionId, answerId, userId } = await request.json();

    if (!questionId || !answerId || !userId) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 });
    }

    // Ensure the user is the question author
    if (question.authorId.toString() !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Unmark any previously accepted answer for this question
    await Answer.updateMany({ questionId }, { $set: { isAccepted: false } });

    // Mark the new answer as accepted
    const acceptedAnswer = await Answer.findByIdAndUpdate(answerId, { isAccepted: true }, { new: true });

    if (!acceptedAnswer) {
      return NextResponse.json({ success: false, message: "Answer not found" }, { status: 404 });
    }

    // Increase reputation for the answer author
    const answerAuthor = await User.findById(acceptedAnswer.authorId);
    if (answerAuthor) {
      answerAuthor.reputation += 15;
      await answerAuthor.save();
    }

    // Send a notification to the answer author
    await Notification.create({
      userId: acceptedAnswer.authorId,
      type: "answer",
      sourceId: acceptedAnswer._id,
      message: "Your answer was accepted!",
      isRead: false,
    });

    return NextResponse.json({ success: true, message: "Answer accepted", data: acceptedAnswer });
  } catch (error) {
    console.error("Error accepting answer:", error);
    return NextResponse.json({ success: false, message: "Error accepting answer" }, { status: 500 });
  }
}
