import mongoose, { Schema, Document } from "mongoose";

export type MatchStatus = "pending" | "accepted" | "rejected" | "completed";

export interface IMentorStudentMatch extends Document {
  studentId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId; // Linking the payment
  agreedAmount: number;
  isPaid: boolean;
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
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }, // Linking to Payment Model
    agreedAmount: { type: Number, required: true }, // Agreed price for mentorship
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create index for faster lookups
MentorStudentMatchSchema.index({ studentId: 1, mentorId: 1 }, { unique: true });

const MentorStudentMatch =
  mongoose.models.MentorStudentMatch ||
  mongoose.model<IMentorStudentMatch>(
    "MentorStudentMatch",
    MentorStudentMatchSchema
  );

export default MentorStudentMatch;
