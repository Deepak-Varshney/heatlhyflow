// import { currentUser } from "@clerk/nextjs/server";
// import connectDB from "./mongodb";
// import User from "@/models/User";

// export const checkUser = async () => {
//     const user = await currentUser();

//     if (!user) {
//         return null;
//     }

//     try {
//         await connectDB();
        
//         // CHANGED: Use findOne to get a single user object or null
//         const loggedInUser = await User.findOne({ clerkUserId: user.id });

//         // This condition now works correctly. If no user is found, loggedInUser is null.
//         if (loggedInUser) {
//             return loggedInUser;
//         }

//         // This code is now reachable for new users.
//         const newUser = await User.create({
//             clerkUserId: user.id,
//             // CHANGED: Match the User schema with firstName and lastName
//             firstName: user.firstName || "", // Provide a fallback for safety
//             lastName: user.lastName || "",   // Provide a fallback for safety
//             imageUrl: user.imageUrl,
//             email: user.emailAddresses[0].emailAddress,
//         });

//         return newUser;
//     } catch (error) {
//         // It's good practice to throw the error or return a structured error response
//         console.error("Error in checkUser:", error);
//         // Depending on your app's needs, you might want to throw the error
//         throw new Error("Failed to check or create user.");
//         // return null; // Or return null on failure
//     }
// };

// lib/getCurrentUser.ts (or wherever you prefer to keep it)

import { auth } from "@clerk/nextjs/server";
import connectDB from "./mongodb";
import User from "@/models/User";

/**
 * Fetches the current user's profile from your MongoDB database.
 * Assumes the user has already been created by the webhook.
 */
export const getMongoUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    await connectDB();
    const user = await User.findOne({ clerkUserId: userId });
    return user;
  } catch (error) {
    console.error("Error fetching Mongo user:", error);
    return null;
  }
};