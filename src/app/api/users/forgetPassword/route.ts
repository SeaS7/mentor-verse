import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/mailer";

function createErrorResponse(message: string, status = 400) {
  return Response.json({ success: false, message }, { status });
}

// Function to generate a random 6-digit code
function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
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
    const user = await UserModel.findOne({ email });
    if (!user) {
      return createErrorResponse("No account found with this email");
    }

    // Generate reset code and expiry
    const resetCode = generateResetCode();
    const hashedResetCode = await bcrypt.hash(resetCode, 10); // Hash the reset code
    const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry

    // Update user with reset code and expiry
    user.forgetPasswordToken = hashedResetCode;
    user.forgetPasswordTokenExpiry = expiryDate;
    await user.save();

    // Send the reset email
    const emailResponse = await sendEmail({
      email: user.email,
      username: user.username,
      otp: resetCode,
      type: "forgot-password",
    });

    if (!emailResponse.success) {
      return createErrorResponse(emailResponse.message, 500);
    }

    return Response.json(
      {
        success: true,
        message: "Password reset instructions sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing forgot password request:", error);
    return createErrorResponse("Error processing request", 500);
  }
}
