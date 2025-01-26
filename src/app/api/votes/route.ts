import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Vote from "@/models/vote.model";

// Helper function to create error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// Handle GET request to check vote status
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const typeId = searchParams.get("typeId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!type || !typeId) {
      return NextResponse.json(
        { success: false, message: "Type and Type ID are required" },
        { status: 400 }
      );
    }

    const votes = await Vote.find({ type, typeId })
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: votes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching votes" },
      { status: 500 }
    );
  }
}
// Handle POST request for voting
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { votedById, voteStatus, type, typeId } = await request.json();

    if (!votedById || !voteStatus || !type || !typeId) {
      return createErrorResponse("Missing required fields", 400);
    }

    const existingVote = await Vote.findOne({ typeId, votedById, type });

    if (existingVote) {
      if (existingVote.voteStatus === voteStatus) {
        await Vote.findByIdAndDelete(existingVote._id);
        return NextResponse.json({
          success: true,
          message: "Vote removed",
          voteResult:
            voteStatus === "upvoted"
              ? existingVote.voteResult - 1
              : existingVote.voteResult + 1,
        });
      }

      existingVote.voteStatus = voteStatus;
      await existingVote.save();
    } else {
      await Vote.create({
        type,
        typeId,
        votedById,
        voteStatus,
      });
    }

    const upvotes = await Vote.countDocuments({ typeId, type, voteStatus: "upvoted" });
    const downvotes = await Vote.countDocuments({ typeId, type, voteStatus: "downvoted" });

    return NextResponse.json({
      success: true,
      message: "Vote updated successfully",
      vote: { votedById, voteStatus, type, typeId },
      voteResult: upvotes - downvotes,
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    return createErrorResponse("Failed to process vote", 500);
  }
}
