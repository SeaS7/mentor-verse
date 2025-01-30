import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Answer from "@/models/answer.model";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await dbConnect();

  try {
    const { userId } = await params;
    const totalAnswers = await Answer.countDocuments( { authorId: userId } );

    return NextResponse.json({ success: true, total: totalAnswers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
