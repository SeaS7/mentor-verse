import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

// Helper function to create error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, code } = await request.json();

    // Validation
    if (!email || !code) {
      return createErrorResponse("Email and verification code are required");
    }

    const normalizedEmail = email.toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Check if user is already verified
    if (user.isVerified) {
      return createErrorResponse("User is already verified", 400);
    }

    // Check if the verification code matches and is not expired
    if (
      user.verifyEmailCode !== code ||
      !user.verifyEmailCodeExpiry ||
      user.verifyEmailCodeExpiry < new Date()
    ) {
      return createErrorResponse("Invalid or expired verification code", 400);
    }

    // Mark the user as verified and clear verification fields
    user.isVerified = true;
    user.verifyEmailCode = null;
    user.verifyEmailCodeExpiry = null;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return createErrorResponse("Error verifying user", 500);
  }
}
