import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMentor extends Document {
  mentor_id: string; // Auto-generated
  user_id: string; // Foreign key to User model
  expertise: string[];
  availability: string;
  base_rate: number;
  bio: string;
}

const MentorSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expertise: { type: [String], required: true },
    availability: { type: String, required: true },
    base_rate: { type: Number, required: true },
    bio: { type: String },
  },
  { timestamps: true }
);

export const MentorModel: Model<IMentor> =
  mongoose.models.Mentor || mongoose.model<IMentor>("Mentor", MentorSchema);