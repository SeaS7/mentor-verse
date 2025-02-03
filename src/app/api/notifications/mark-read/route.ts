import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Notification from "@/models/notification.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
    }

    await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });

    return NextResponse.json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
