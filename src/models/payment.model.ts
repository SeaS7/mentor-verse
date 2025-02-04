import mongoose, { Schema, Document } from "mongoose";

// Define payment status types
export type PaymentStatus = "pending" | "completed" | "failed";

export interface IPayment extends Document {
  studentId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
}

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: { type: String,  required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
