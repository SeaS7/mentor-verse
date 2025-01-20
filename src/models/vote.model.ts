import mongoose, { Schema, Document } from "mongoose";

// Define interface for TypeScript
export interface IVote extends Document {
  type: "question" | "answer";
  typeId: mongoose.Types.ObjectId;
  voteStatus: "upvoted" | "downvoted";
  votedById: mongoose.Types.ObjectId;
}

// Define Vote Schema
const VoteSchema: Schema = new Schema<IVote>(
  {
    type: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type", // Dynamic reference to either Question or Answer model
    },
    voteStatus: {
      type: String,
      enum: ["upvoted", "downvoted"],
      required: true,
    },
    votedById: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the User model
    },
  },
  { timestamps: true }
);

// Creating Indexes to Optimize Queries
VoteSchema.index({ typeId: 1, votedById: 1 }, { unique: true }); // Ensures unique votes per user per type
VoteSchema.index({ votedById: 1 });

const Vote = mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;
