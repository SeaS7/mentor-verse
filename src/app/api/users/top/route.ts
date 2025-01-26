import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";

export async function GET() {
  await dbConnect();

  try {
    const topUsers = await UserModel.find({})
      .sort({ reputation: -1 }) // Sort by highest reputation
      .limit(10)
      .select("_id username reputation updatedAt profileImg");

    return NextResponse.json({ success: true, users: topUsers });
  } catch (error) {
    console.error("Error fetching top users:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching users" },
      { status: 500 }
    );
  }
}
