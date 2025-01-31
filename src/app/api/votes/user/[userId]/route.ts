import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Vote from "@/models/vote.model";
import Question from "@/models/question.model";
import Answer from "@/models/answer.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const voteStatus = searchParams.get("voteStatus");
    const skip = (page - 1) * limit;

    // Base query
    const query: any = { votedById: params.userId };
    if (voteStatus) query.voteStatus = voteStatus;

    // Fetch votes with pagination
    const votes = await Vote.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Vote.countDocuments(query);

    // Fetch related questions or answers
    const enrichedVotes = await Promise.all(
      votes.map(async (vote) => {
        let question = null;

        if (vote.type === "question") {
          question = await Question.findById(vote.typeId).select("title");
        } else {
          const answer = await Answer.findById(vote.typeId).select(
            "questionId"
          );
          if (answer) {
            question = await Question.findById(answer.questionId).select(
              "title"
            );
          }
        }

        return {
          ...vote,
          question: question
            ? { _id: question._id, title: question.title }
            : null,
        };
      })
    );

    const filteredVotes = enrichedVotes.filter(
      (vote) => vote.question !== null
    );

    return NextResponse.json(
      { success: true, data: filteredVotes, total: filteredVotes.length },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
