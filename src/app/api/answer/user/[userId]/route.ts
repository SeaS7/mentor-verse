import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Answer from "@/models/answer.model";
import Question from "@/models/question.model"; // Ensure this import exists!

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect(); // Ensure database connection

  try {
    const { userId } = await params;
    const searchParams = new URL(req.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 25;
    const skip = (page - 1) * limit;

    // Fetch user answers with pagination and related question titles
    const answers = await Answer.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "questionId", // Ensure correct population field
        model: Question, // Explicitly reference the correct model name
        select: "title", // Only fetch the title
      })
      .lean();

    // Get total count of answers
    const total = await Answer.countDocuments({ authorId: userId });
    console.log("Total answers:", total);
    console.log("Fetched answers:", answers);
    
    

    return NextResponse.json({ success: true, data: answers, total }, { status: 200 });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching answers" },
      { status: 500 }
    );
  }
}
