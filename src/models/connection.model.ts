import mongoose, { Schema, Document } from "mongoose";

export type MatchStatus = "pending" | "accepted" | "rejected" | "completed";

export interface IMentorStudentMatch extends Document {
  studentId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  status: MatchStatus;
  criteria: string;
  paymentId?: mongoose.Types.ObjectId; // Linking the payment
  agreedAmount: number;
  isPaid: boolean;
  sessionCount?: number;
}

const MentorStudentMatchSchema: Schema = new Schema<IMentorStudentMatch>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    criteria: { type: String, required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }, // Linking to Payment Model
    agreedAmount: { type: Number, required: true }, // Agreed price for mentorship
    isPaid: { type: Boolean, default: false }, // Track payment status
    sessionCount: { type: Number, default: 0 }, // Number of sessions agreed
  },
  { timestamps: true }
);

// Create index for faster lookups
MentorStudentMatchSchema.index({ studentId: 1, mentorId: 1 }, { unique: true });

const MentorStudentMatch = mongoose.model<IMentorStudentMatch>(
  "MentorStudentMatch",
  MentorStudentMatchSchema
);

export default MentorStudentMatch;
