import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  student_id: string; // Auto-generated
  user_id: string; // Foreign key to User model
  education_level: string;
  interests: string[];
}

const StudentSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    education_level: { type: String },
    interests: { type: [String] },
  },
  { timestamps: true }
);

export const StudentModel: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);
