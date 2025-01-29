import { NextResponse } from "next/server";
import { getPaginatedQuestions } from "@/utils/questionService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const tag = searchParams.get("tag") || "";
    const search = searchParams.get("search") || "";

    const { questionStats, total } = await getPaginatedQuestions(page, limit, tag, search);

    return NextResponse.json({ success: true, data: questionStats, total });
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
