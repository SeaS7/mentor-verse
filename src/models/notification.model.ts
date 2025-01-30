import mongoose, { Schema, Document, Model } from "mongoose";

// Define Notification Interface for TypeScript
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "answer" | "vote" | "comment"; // Type of notification
  sourceId: mongoose.Types.ObjectId; // ID of the answer, vote, or comment
  message: string; // Notification message
  isRead: boolean; // Read status
  createdAt: Date;
}

// Define Notification Schema
const NotificationSchema: Schema = new Schema<INotification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["answer", "vote", "comment", "request"],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create Notification Model
const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
