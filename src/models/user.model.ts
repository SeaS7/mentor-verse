import mongoose, { Schema, Document, Model } from "mongoose";

// Step 1: Define the interface
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user"; // Enum
  createdAt: Date;
  isVerified: boolean;
  forgetPasswordToken: string;
  forgetPasswordTokenExpiry: Date;
  verifyEmailToken: string;
  verifyEmailTokenExpiry: Date;
}

// Step 2: Create the schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isVerified: { type: Boolean, default: false },
    forgetPasswordToken: { type: String },
    forgetPasswordTokenExpiry: { type: Date },
    verifyEmailToken: { type: String },
    verifyEmailTokenExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, 
  }
);

// Step 3: Create the model
const User: Model<User> =
  mongoose.models.users || mongoose.model<User>("users", UserSchema);

export default User;
