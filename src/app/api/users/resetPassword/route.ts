import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";


function createErrorResponse(message: string, status = 400) {
    return Response.json({ success: false, message }, { status });
  }

  
export async function POST(request: Request) {
    await dbConnect();
  
    try {
      const { email, resetCode, newPassword } = await request.json();
  
      // Validate input
      if (!email || !resetCode || !newPassword) {
        return createErrorResponse("All fields are required");
      }
  
      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return createErrorResponse("No account found with this email");
      }
  
      // Validate token expiry
      if (!user.forgetPasswordToken || !user.forgetPasswordTokenExpiry) {
        return createErrorResponse("Invalid or expired reset token");
      }
  
      const now = new Date();
      if (user.forgetPasswordTokenExpiry < now) {
        return createErrorResponse("Reset token has expired");
      }
  
      // Compare reset token
      const isValidToken = await bcrypt.compare(resetCode, user.forgetPasswordToken);
      if (!isValidToken) {
        return createErrorResponse("Invalid reset token");
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update user password and clear reset token
      user.password = hashedPassword;
      user.forgetPasswordToken = null;
      user.forgetPasswordTokenExpiry = null;
      await user.save();
  
      return Response.json(
        {
          success: true,
          message: "Password reset successful.",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error processing reset password request:", error);
      return createErrorResponse("Error processing request", 500);
    }
  }
  