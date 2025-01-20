import mongoose, { Schema, Document } from "mongoose";

// Define Answer Schema Interface
interface IAnswer extends Document {
  content: string;
  questionId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
}

// Define Answer Schema
const AnswerSchema: Schema = new Schema<IAnswer>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 10000, // Maximum content length
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question", // Referencing Question model
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Referencing User model
    },
  },
  { timestamps: true }
);

// Create Indexes (Equivalent to setting IndexType in Appwrite)
AnswerSchema.index({ questionId: 1 }, { unique: false });
AnswerSchema.index({ authorId: 1 }, { unique: false });

const Answer = mongoose.model<IAnswer>("Answer", AnswerSchema);

export default Answer;
