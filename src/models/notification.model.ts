import mongoose, { Schema, Document, Model } from "mongoose";

// Define Notification Interface for TypeScript
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "answer" | "vote" | "comment" | "message"; // ✅ Added "message" type
  sourceId?: mongoose.Types.ObjectId; // ✅ Made optional for "message" type
  message: string;
  isRead: boolean;
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
      enum: ["answer", "vote", "comment", "message"], // ✅ Added "message"
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: function (this: INotification) {
        return this.type !== "message"; // ✅ sourceId is required for everything except "message"
      },
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
