import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import NotificationModel from "@/models/notification.model";
import  Notification  from "@/models/notification.model";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = req.nextUrl.searchParams.get("userId");


  if (!userId) {
    return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
  }

  try {
    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching notifications" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { userId, type, sourceId, message } = await req.json();

    if (!userId || !type || !message) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    let formattedSourceId: mongoose.Types.ObjectId | undefined;
    if (sourceId && mongoose.Types.ObjectId.isValid(sourceId)) {
      formattedSourceId = new mongoose.Types.ObjectId(sourceId);
    }

    const newNotification = new Notification({
      userId,
      type,
      sourceId: formattedSourceId, // ✅ Converts Firestore ID only if it's a valid ObjectId
      message,
      isRead: false,
    });

    await newNotification.save();
    return NextResponse.json({ success: true, notification: newNotification });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    return NextResponse.json({ success: false, message: "Error creating notification" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const { sourceId, userId } = await req.json();

    if (!sourceId || !userId) {
      return NextResponse.json({ success: false, message: "Missing sourceId or userId" }, { status: 400 });
    }

    const result = await Notification.deleteOne({  sourceId, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    return NextResponse.json({ success: false, message: "Error deleting notification" }, { status: 500 });
  }
}