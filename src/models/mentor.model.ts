import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview {
  user_id: mongoose.Schema.Types.ObjectId; // Reference to User model
  review_text: string;
  rating: number; // 1 to 5 stars
  createdAt: Date;
}

export interface IMentor extends Document {
  mentor_id: string; // Auto-generated
  user_id: mongoose.Schema.Types.ObjectId; // Foreign key to User model
  expertise: string[];
  availability: string;
  base_rate: number;
  bio: string;
  rating: number; // Average rating
  reviews: IReview[]; // Array of reviews
}

const ReviewSchema: Schema = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    review_text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Prevents Mongoose from creating separate IDs for reviews
);

const MentorSchema: Schema = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expertise: { type: [String], required: true },
    availability: { type: String, required: true },
    base_rate: { type: Number, required: true },
    bio: { type: String },
    rating: { type: Number, default: 0 }, // Average rating
    reviews: { type: [ReviewSchema], default: [] }, // List of reviews
  },
  { timestamps: true }
);

export const MentorModel: Model<IMentor> =
  mongoose.models.Mentor || mongoose.model<IMentor>("Mentor", MentorSchema);
