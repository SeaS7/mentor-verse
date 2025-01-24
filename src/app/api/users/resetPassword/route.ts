import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return createErrorResponse("Invalid request", 400);
    }

    // Find user by token
    const user = await UserModel.findOne({
      forgetPasswordToken: { $exists: true },
      forgetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return createErrorResponse("Invalid or expired token", 400);
    }

    // Validate the token
    if (!user.forgetPasswordToken) {
      return createErrorResponse("Invalid or expired token", 400);
    }
    const isTokenValid = await bcrypt.compare(token, user.forgetPasswordToken);
    if (!isTokenValid) {
      return createErrorResponse("Invalid or expired token", 400);
    }

    // Hash the new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.forgetPasswordToken = null;
    user.forgetPasswordTokenExpiry = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return createErrorResponse("Error processing request", 500);
  }
}
