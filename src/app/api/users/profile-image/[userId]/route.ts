import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  await dbConnect();

  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }


    return NextResponse.json(
      { success: true, profileImg: user.profileImg },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching profile image" },
      { status: 500 }
    );
  }
}
