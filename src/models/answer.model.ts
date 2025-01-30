import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer extends Document {
  content: string;
  authorId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  isAccepted: boolean;
}

const AnswerSchema: Schema = new Schema<IAnswer>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Answer =
  mongoose.models.Answer || mongoose.model<IAnswer>("Answer", AnswerSchema);

export default Answer;
