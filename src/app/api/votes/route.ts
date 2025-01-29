import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Vote from "@/models/vote.model";


// Handle GET request to check vote status

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const typeId = searchParams.get("typeId");
    const status = searchParams.get("status"); // Optional status filter

    // Validate required parameters
    if (!type || !typeId) {
      return NextResponse.json(
        { success: false, message: "Type and Type ID are required" },
        { status: 400 }
      );
    }

    // Build query object
    const query: any = { type, typeId };
    if (status) {
      query.voteStatus = status; // Filter by voteStatus if provided
    }

    // Get the count of votes
    const voteCount = await Vote.countDocuments(query);

    return NextResponse.json(
      { success: true, count: voteCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching vote count:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching vote count" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { votedById, voteStatus, type, typeId } = await request.json();

    if (!votedById || !voteStatus || !type || !typeId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingVote = await Vote.findOne({ typeId, votedById, type });

    if (existingVote) {
      if (existingVote.voteStatus === voteStatus) {
        // If the vote status is the same, remove the vote
        await Vote.findByIdAndDelete(existingVote._id);

        const upvotes = await Vote.countDocuments({ typeId, type, voteStatus: "upvoted" });
        const downvotes = await Vote.countDocuments({ typeId, type, voteStatus: "downvoted" });

        return NextResponse.json({
          success: true,
          message: "Vote removed",
          voteResult: upvotes - downvotes,
        });
      }

      // Update the existing vote
      existingVote.voteStatus = voteStatus;
      await existingVote.save();
    } else {
      // Create a new vote
      await Vote.create({ type, typeId, votedById, voteStatus });
    }

    const upvotes = await Vote.countDocuments({ typeId, type, voteStatus: "upvoted" });
    const downvotes = await Vote.countDocuments({ typeId, type, voteStatus: "downvoted" });

    return NextResponse.json({
      success: true,
      message: "Vote updated successfully",
      vote: { votedById, voteStatus, type, typeId },
      voteResult: upvotes - downvotes,
    });
  } catch (error: any) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process vote", error: error.message },
      { status: 500 }
    );
  }
}

