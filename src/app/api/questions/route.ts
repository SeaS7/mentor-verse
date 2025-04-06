import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";
import Answer from "@/models/answer.model";
import Vote from "@/models/vote.model";

// Error handler
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 5);
    const skip = (page - 1) * limit;

    // Step 1: Get questions with author info
    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "username reputation profileImg")
      .lean() as Array<{ _id: string; [key: string]: any }>;

    if (!questions.length) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No questions found.",
      });
    }

    const questionIds = questions.map((q) => q._id);

    // Step 2: Get answers and votes in batch
    const [answerCounts, voteCounts] = await Promise.all([
      Answer.aggregate([
        { $match: { questionId: { $in: questionIds } } },
        { $group: { _id: "$questionId", count: { $sum: 1 } } },
      ]),
      Vote.aggregate([
        {
          $match: {
            type: "question",
            typeId: { $in: questionIds },
          },
        },
        {
          $group: {
            _id: "$typeId",
            upvotes: {
              $sum: { $cond: [{ $eq: ["$voteStatus", "upvoted"] }, 1, 0] },
            },
            downvotes: {
              $sum: { $cond: [{ $eq: ["$voteStatus", "downvoted"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    // Step 3: Map answers and votes to their questions
    const answerMap = Object.fromEntries(
      answerCounts.map((item) => [item._id.toString(), item.count])
    );

    const voteMap = Object.fromEntries(
      voteCounts.map((item) => [
        item._id.toString(),
        item.upvotes - item.downvotes,
      ])
    );

    // Step 4: Combine all data into final response
    const questionStats = questions.map((ques) => {
      const id = (ques._id as string).toString();
      return {
        ...ques,
        totalAnswers: answerMap[id] || 0,
        totalVotes: voteMap[id] || 0,
      };
    });

    return NextResponse.json({ success: true, data: questionStats }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return createErrorResponse("Server error", 500);
  }
}
