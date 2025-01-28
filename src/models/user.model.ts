import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
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
  reputation: number;
}

const UserSchema: Schema<IUser> = new Schema(
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
    forgetPasswordToken: { type: String, default: null },
    forgetPasswordTokenExpiry: { type: Date, default: null },
    verifyEmailCode: { type: String, required: [true, "Verify Code is required"] },
    verifyEmailCodeExpiry: { type: Date, required: [true, "Verify Code Expiry is required"] },
    reputation: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    profileImg: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Ensure the model name matches the `ref` value used in other schemas
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
