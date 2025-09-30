import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const getAllUsers = async () => {
    await connectDB();
    const pendingUsers = await User.find({});
    return pendingUsers
}