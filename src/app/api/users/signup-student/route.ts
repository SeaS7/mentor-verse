import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import { StudentModel } from "@/models/student.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/mailer";
import { NextResponse } from "next/server";
import { MentorModel } from "@/models/mentor.model";
import mongoose from "mongoose";

function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password, education_level, interests } = await request.json();

    if (!username || !email || !password || !education_level || !interests) {
      return createErrorResponse("All fields are required");
    }

    const normalizedEmail = email.toLowerCase();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return createErrorResponse("Username is already taken", 400);
    }

    const existingUserByEmail = await UserModel.findOne({ email: normalizedEmail });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return createErrorResponse("User already exists with this email", 400);
      } else {
        // Delete the unverified user and related records
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          await MentorModel.deleteOne({ user_id: existingUserByEmail._id }).session(session);
          await StudentModel.deleteOne({ user_id: existingUserByEmail._id }).session(session);
          await existingUserByEmail.deleteOne().session(session);

          await session.commitTransaction();
        } catch (err) {
          await session.abortTransaction();
          return createErrorResponse("Error cleaning up old data", 500);
        } finally {
          session.endSession();
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyEmailCode = generateVerificationCode();
    const verifyEmailCodeExpiry = new Date(Date.now() + 3600000);

    const user = await UserModel.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      verifyEmailCode,
      verifyEmailCodeExpiry,
      isVerified: false,
    });

    await StudentModel.create({
      user_id: user._id,
      education_level,
      interests,
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
      message: "Student registered successfully. Please verify your account.",
    }, { status: 201 });

  } catch (error) {
    console.error("Error in student signup API:", error);
    return createErrorResponse("Error registering student", 500);
  }
}
