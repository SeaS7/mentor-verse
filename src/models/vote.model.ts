import mongoose, { Schema, Document } from "mongoose";

export interface IVote extends Document {
  type: "question" | "answer";
  typeId: mongoose.Types.ObjectId;
  votedById: mongoose.Types.ObjectId;
  voteStatus: "upvoted" | "downvoted";
}

const VoteSchema: Schema = new Schema<IVote>(
  {
    type: {
      type: String,
      required: true,
      enum: ["question", "answer"],
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type",
    },
    votedById: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    voteStatus: {
      type: String,
      enum: ["upvoted", "downvoted"],
      required: true,
    },
  },
  { timestamps: true }
);

const Vote = mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;
