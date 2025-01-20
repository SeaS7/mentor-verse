import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import { AdminModel } from "@/models/admin.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/mailer";
import { NextResponse } from "next/server";

function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password, admin_role } = await request.json();

    if (!username || !email || !password || !admin_role) {
      return createErrorResponse("All fields are required");
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser?.isVerified) {
      return createErrorResponse("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyEmailCode = generateVerificationCode();
    const verifyEmailCodeExpiry = new Date(Date.now() + 3600000);

    const user = await UserModel.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      verifyEmailCode,
      verifyEmailCodeExpiry,
      isVerified: false,
    });

    await AdminModel.create({
      user_id: user._id,
      role: admin_role,
    });

    const emailResponse = await sendEmail({
      email: normalizedEmail,
      username,
      otp: verifyEmailCode,
      type: "verification",
    });

    if (!emailResponse.success) {
      return createErrorResponse(emailResponse.message, 500);
    }

    return NextResponse.json({
      success: true,
      message: "Admin registered successfully. Please verify your account.",
    }, { status: 201 });

  } catch (error) {
    console.error("Error in admin signup API:", error);
    return createErrorResponse("Error registering admin", 500);
  }
}
