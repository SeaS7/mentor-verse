import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
  mentorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  sessionLink: string[];
}

const SessionSchema: Schema = new Schema<ISession>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    sessionLink: { type: [String] },
  },
  { timestamps: true }
);

// ✅ Fix: Check if model exists before defining
const SessionModel = mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default SessionModel;
