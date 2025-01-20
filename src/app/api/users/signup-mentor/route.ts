import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import { MentorModel } from "@/models/mentor.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/mailer";
import { NextResponse } from "next/server";
import { StudentModel } from "@/models/student.model";

function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const {
      username,
      email,
      password,
      expertise,
      availability,
      base_rate,
      bio,
      skills,
    } = await request.json();

    if (
      !username ||
      !email ||
      !password ||
      !expertise ||
      !availability ||
      !base_rate
    ) {
      return createErrorResponse("All fields are required");
    }

    const normalizedEmail = email.toLowerCase();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email : normalizedEmail });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else if (existingUserByEmail.isVerified === false) {
        const mentor = await MentorModel.findOne({ user_id : existingUserByEmail._id });
        const student = await StudentModel.findOne({ user_id : existingUserByEmail._id });
        await existingUserByEmail.deleteOne();
        await mentor?.deleteOne();
        await student?.deleteOne();

      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyEmailCode = generateVerificationCode();
    const verifyEmailCodeExpiry = new Date(Date.now() + 3600000);

    const user = await UserModel.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role: "mentor",
      verifyEmailCode,
      verifyEmailCodeExpiry,
      isVerified: false,
    });

    await MentorModel.create({
      user_id: user._id,
      expertise,
      availability,
      base_rate,
      bio,
      skills,
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

    return NextResponse.json(
      {
        success: true,
        message: "Mentor registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in mentor signup API:", error);
    return createErrorResponse("Error registering mentor", 500);
  }
}
