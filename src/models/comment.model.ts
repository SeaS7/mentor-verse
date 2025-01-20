import mongoose, { Schema, Document } from "mongoose";

// Define interface for TypeScript
export interface IComment extends Document {
  content: string;
  type: "answer" | "question";
  typeId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
}

// Define Comment Schema
const CommentSchema: Schema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 10000, // Limit content length as per Appwrite
    },
    type: {
      type: String,
      enum: ["answer", "question"],
      required: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type", // Dynamic reference to either Answer or Question model
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Create Indexes
CommentSchema.index({ typeId: 1 }, { unique: false });
CommentSchema.index({ authorId: 1 }, { unique: false });

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
