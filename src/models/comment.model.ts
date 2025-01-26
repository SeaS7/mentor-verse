import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  authorId: mongoose.Types.ObjectId;
  type: "question" | "answer";
  typeId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: ["question", "answer"],
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
