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
    const limit = Number(searchParams.get("limit") || 5);

    // Step 1: Get questions with author info
    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("authorId", "username reputation profileImg")
      .lean();

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
    const answerMap = answerCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const voteMap = voteCounts.reduce((acc, item) => {
      const id = item._id.toString();
      acc[id] = item.upvotes - item.downvotes;
      return acc;
    }, {} as Record<string, number>);

    // Step 4: Combine all data into final response
    const questionStats = questions.map((ques) => {
      const id = ques._id.toString();
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
