import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Vote from "@/models/vote.model";
import User from "@/models/user.model";
import Notification from "@/models/notification.model";


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
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Check if the vote already exists
    let existingVote = await Vote.findOne({ typeId, votedById, type });

    let voteResultChange = 0; // Track how the vote affects the result

    if (existingVote) {
      if (existingVote.voteStatus === voteStatus) {
        // If the user clicks again on the same vote, remove it
        await Vote.findByIdAndDelete(existingVote._id);
        voteResultChange = voteStatus === "upvoted" ? -1 : 1;
        existingVote = null;
      } else {
        // If the user switches vote (upvote <-> downvote)
        voteResultChange = voteStatus === "upvoted" ? 2 : -2;
        existingVote.voteStatus = voteStatus;
        await existingVote.save();
      }
    } else {
      // New vote
      await Vote.create({ type, typeId, votedById, voteStatus });
      voteResultChange = voteStatus === "upvoted" ? 1 : -1;
    }

    // Calculate total upvotes and downvotes
    const totalUpvotes = await Vote.countDocuments({ type, typeId, voteStatus: "upvoted" });
    const totalDownvotes = await Vote.countDocuments({ type, typeId, voteStatus: "downvoted" });
    const voteResult = totalUpvotes - totalDownvotes;

    // Find the post owner
    const postOwner = await User.findById(votedById);

    if (postOwner) {
      // Create a notification
      await Notification.create({
        userId: postOwner._id,
        type: "vote",
        sourceId: typeId,
        message: `Someone ${voteStatus} your post!`,
        isRead: false,
      });

      // Update reputation
      if (voteStatus === "upvoted") {
        postOwner.reputation += 10;
      } else {
        postOwner.reputation -= 5;
      }
      await postOwner.save();
    }
    console.log(postOwner);
    

    return NextResponse.json({
      success: true,
      message: "Vote processed",
      voteStatus: existingVote ? existingVote.voteStatus : null,
      voteResult, // Return updated vote count
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json({ success: false, message: "Error processing vote" }, { status: 500 });
  }
}
