// models/User.ts
import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  clerkUserId: string;
  imageUrl?: string;
  role: string; // Can be an enum-like string
  createdAt?: Date;
  updatedAt?: Date;
  credits: number;
  specialty?: string;
  experience?: number;
  credentialUrl?: string;
  description?: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED"; // Enum-like status
  patientAppointments?: any[]; // Populate if needed
  doctorAppointments?: any[];  // Populate if needed
  availabilities?: any[];      // Populate if needed
}

const UserSchema = new Schema<IUser>(
  {
    clerkUserId: {
      type: String,
      required: [true, "Clerk user ID is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    imageUrl: { type: String },
    role: {
      type: String,
      enum: ["UNASSIGNED", "RECEPTIONIST", "DOCTOR", "SUPERADMIN", "ADMIN"],
      default: "UNASSIGNED",
    },
    credits: {
      type: Number,
      default: 2,
    },
    specialty: {
      type: String,
    },
    experience: {
      type: Number,
    },
    description: {
      type: String,
      required: false,
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
    doctorAppointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    availabilities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Availability",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);


const User = models.User || model<IUser>("User", UserSchema);

export default User;
