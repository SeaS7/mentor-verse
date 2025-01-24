import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/mailer";
import { NextResponse } from "next/server";
import crypto from "crypto";

function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    // Validate email input
    if (!email) {
      return createErrorResponse("Email is required");
    }

    // Find user by email
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return createErrorResponse("No account found with this email", 404);
    }

    // Generate a secure reset token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = await bcrypt.hash(resetToken, 10); // Hash the token
    const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry

    // Update user with reset token and expiry
    user.forgetPasswordToken = hashedResetToken;
    user.forgetPasswordTokenExpiry = expiryDate;
    await user.save();

    // Construct password reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    // Send the reset email
    const emailResponse = await sendEmail({
      email: user.email,
      username: user.username,
      otp: resetLink,
      type: "forgot-password",
    });

    if (!emailResponse.success) {
      return createErrorResponse(emailResponse.message, 500);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password reset link sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing forgot password request:", error);
    return createErrorResponse("Error processing request. Please try again.", 500);
  }
}
