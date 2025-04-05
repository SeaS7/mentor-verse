import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/verificationEmail";
import ForgotPasswordEmail from "../../emails/forgetPasswordEmail";
import { JSX } from "react";

type EmailType = "verification" | "forgot-password";

interface EmailOptions {
  email: string;
  username: string;
  otp: string;
  type: EmailType;
}

export async function sendEmail({
  email,
  username,
  otp,
  type,
}: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    let subject: string;
    let html: string;

    if (type === "verification") {
      subject = "MentorVerse Verification Code";
      html = await render(
        VerificationEmail({ username, otp }) as JSX.Element
      );
    } else if (type === "forgot-password") {
      subject = "MentorVerse Password Reset Code";
      html = await render(
        ForgotPasswordEmail({ username, resetCode: otp }) as JSX.Element
      );
    } else {
      throw new Error("Invalid email type");
    }

    await transporter.sendMail({
      from: `"MentorVerse" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject,
      html,
    });

    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, message: "Failed to send email." };
  }
}
