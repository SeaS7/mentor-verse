import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import dbConnect from "@/lib/dbConfig";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Read the raw file stream from the request body
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert buffer to base64 for Cloudinary upload
    const base64Image = buffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64Image}`; // Assuming PNG, adjust as needed

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(dataUri, {
      folder: "mentorVerse",
      resource_type: "auto",
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      url: uploadResponse.secure_url, // Cloudinary file URL
      public_id: uploadResponse.public_id, // Cloudinary public ID
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "File upload failed" },
      { status: 500 }
    );
  }
}
