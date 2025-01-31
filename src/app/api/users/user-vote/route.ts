import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Vote from "@/models/vote.model";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const type = searchParams.get("type");
    const typeId = searchParams.get("typeId");
    const votedById = searchParams.get("votedById");

    // Validate required fields
    if (!type || !typeId || !votedById) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Find the vote by user and resource
    const vote = await Vote.findOne({ type, typeId, votedById });


    if (!vote) {
      return NextResponse.json(
        { success: true, vote: null }, // No vote found
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        vote: {
          voteStatus: vote.voteStatus, // Either "upvoted" or "downvoted"
          type: vote.type,
          typeId: vote.typeId,
          votedById: vote.votedById,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching vote status" },
      { status: 500 }
    );
  }
}
