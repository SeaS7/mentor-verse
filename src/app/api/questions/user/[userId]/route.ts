import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";
import Answer from "@/models/answer.model";
import Vote from "@/models/vote.model";
import User from "@/models/user.model";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const userId = await params.userId;
    // Fetch user questions with pagination
    const questions = await Question.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "username reputation profileImg")
      .lean();

    const total = await Question.countDocuments({ authorId: userId});

    // Fetch additional stats for each question (total answers & votes)
    const enrichedQuestions = await Promise.all(
      questions.map(async (ques) => {
        const [totalAnswers, totalVotes, author] = await Promise.all([
          Answer.countDocuments({ questionId: ques._id }),
          Vote.countDocuments({ type: "question", typeId: ques._id }),
          User.findById(ques.authorId).select("username profileImg reputation"),
        ]);

        return {
          ...ques,
          totalAnswers,
          totalVotes,
          author: {
            _id: author?._id || "unknown",
            username: author?.username || "Anonymous",
            profileImg: author?.profileImg || "/default-avatar.png",
            reputation: author?.reputation || 0,
          },
        };
      })
    );

    return NextResponse.json({ success: true, data: enrichedQuestions, total }, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
