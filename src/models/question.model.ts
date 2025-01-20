import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript
export interface IQuestion extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  tags?: string[];
  attachmentId?: string;
}

// Define Question Schema
const QuestionSchema: Schema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100, // Max length similar to Appwrite
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000, // Max length similar to Appwrite
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    tags: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.length <= 50, // Validate max length per tag
        message: "Each tag should be a maximum of 50 characters",
      },
    },
    attachmentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Create Indexes (Equivalent to Appwrite's Indexing)
QuestionSchema.index({ title: "text" });
QuestionSchema.index({ content: "text" });

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
