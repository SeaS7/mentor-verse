import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Notification from "@/models/notification.model";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await dbConnect();

  try {
    const { userId } = await params;
    const notifications = await Notification.find({ userId})
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ success: true, data: notifications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
