
import mongoose, { Schema, Document, Model } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "mentor" | "student"; // Enum
  createdAt: Date;
  isVerified: boolean;
  forgetPasswordToken: string | null;
  forgetPasswordTokenExpiry: Date | null;
  verifyEmailCode: string | null;
  verifyEmailCodeExpiry: Date | null;
  profileImg: string;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/.+\@.+\..+/, "Please use a valid email address"],
      unique: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: ["admin", "mentor", "student"],
      default: "student",
    },
    isVerified: { type: Boolean, default: false },
    forgetPasswordToken: { type: String },
    forgetPasswordTokenExpiry: { type: Date },
    verifyEmailCode: {
      type: String,
      required: [true, "Verify Code is required"],
    },
    verifyEmailCodeExpiry: {
      type: Date,
      required: [true, "Verify Code Expiry is required"],
    },
    createdAt: { type: Date, default: Date.now },
    profileImg: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User: Model<User> =
  mongoose.models.users || mongoose.model<User>("users", UserSchema);

export default User;
