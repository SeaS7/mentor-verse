import mongoose, { Schema, Document } from "mongoose";

// Define payment status types
export type PaymentStatus = "pending" | "completed" | "failed";

export interface IPayment extends Document {
  studentId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  mentorStudentMatchId: mongoose.Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
}

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentorStudentMatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorStudentMatch",
      required: true,
    },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

// Create an index to optimize queries on mentor-student connection
PaymentSchema.index({ mentorStudentMatchId: 1, studentId: 1 });

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
