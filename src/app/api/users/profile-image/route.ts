import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import User from "@/models/user.model";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Extract form data
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary with transformation
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_images",
          transformation: [
            { width: 760, height: 760, gravity: "face", crop: "thumb" }, // Focus on the face
            { quality: "auto" }, // Optimize quality
            { fetch_format: "auto" } // Auto-select the best format
          ],
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return resolve(NextResponse.json({ success: false, message: "Image upload failed" }, { status: 500 }));
          }

          // Update user profile image
          user.profileImg = result?.secure_url || "";
          await user.save();

          return resolve(NextResponse.json({ success: true, profileImg: user.profileImg }, { status: 200 }));
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error processing image upload:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
