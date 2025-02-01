import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConfig"; // Ensure you have a database connection helper
import { MentorModel } from "@/models/mentor.model"; // Import your mentor model
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure the database is connected

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { mentor_id, user_id, review_text, rating } = req.body;

    // Validate input
    if (!mentor_id || !user_id || !review_text || rating == null) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Find mentor by ID
    const mentor = await MentorModel.findById(mentor_id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }

    // Create new review object
    const newReview = {
      user_id: user_id,
      review_text,
      rating,
      createdAt: new Date(),
    };

    // Add the new review to the mentor's reviews array
    mentor.reviews.push(newReview);

    // Calculate the new average rating
    const totalRatings = mentor.reviews.reduce((sum, review) => sum + review.rating, 0);
    mentor.rating = totalRatings / mentor.reviews.length;

    // Save the mentor with the updated reviews and rating
    await mentor.save();

    return res.status(200).json({
      success: true,
      message: "Review added successfully",
      mentor,
    });

  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
