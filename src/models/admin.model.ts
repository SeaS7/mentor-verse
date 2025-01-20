import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  admin_id: string; // Auto-generated
  user_id: string; // Foreign key to User model
  role: string; // Admin-specific role
}

const AdminSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true }, // e.g., "superadmin", "moderator"
  },
  { timestamps: true }
);

export const AdminModel: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
