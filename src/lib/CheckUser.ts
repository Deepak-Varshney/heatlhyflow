import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "./mongodb";
import User from "@/models/User";

/**
 * Fetches the current user's profile from your MongoDB database.
 * Assumes the user has already been created by the webhook.
 */
export const getMongoUser = async () => {
  const {userId} = await auth();
  if (!userId) {
    return null;
  }
  try {
    await connectDB();
    const muser = await User.findOne({clerkUserId:userId});

    return muser;
  } catch (error) {
    console.error("Error fetching Mongo user:", error);
    return null;
  }
};