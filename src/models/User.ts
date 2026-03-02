import { Schema, model, models, Document } from "mongoose";

// Yeh IAvailabilityRule ka definition hai
export interface IAvailabilityRule {
  dayOfWeek: string; // e.g., "Monday"
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "17:00"
  _id?: any;
}

export interface IAvailability extends Document {
  doctor: Schema.Types.ObjectId; // This will reference a User document
  startTime: Date;
  endTime: Date;
  status: 'available' | 'booked';
  _id: Schema.Types.ObjectId | any;
}


export interface IUser extends Document {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  role: "UNASSIGNED" | "RECEPTIONIST" | "DOCTOR"  | "SUPERADMIN" | "DEVIL";
  organization: Schema.Types.ObjectId;
  _id: Schema.Types.ObjectId | any;

  // Doctor-specific fields
  specialty?: string;
  experience?: number;
  description?: string;
  consultationFee?: number; // Default consultation fee for the doctor
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  weeklyAvailability: IAvailabilityRule[]; // Yahan IAvailabilityRule ka istemaal hota hai

  // Clinic-specific fields for doctors
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  watermarkImageUrl?: string; // URL for clinic watermark image

  // Relations
  appointments: Schema.Types.ObjectId[];
}

// Yeh ek chota "sub-schema" hai jo batata hai ki har rule kaisa dikhega
const AvailabilityRuleSchema = new Schema<IAvailabilityRule>({
  dayOfWeek: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { _id: false }); // _id: false zaroori hai embedded documents ke liye

const UserSchema = new Schema<IUser>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    imageUrl: { type: String },
    role: {
      type: String,
      enum: ["UNASSIGNED", "RECEPTIONIST", "DOCTOR", "SUPERADMIN", "DEVIL"],
      default: "UNASSIGNED",
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    specialty: { type: String },
    experience: { type: Number },
    description: { type: String },
    consultationFee: { type: Number, min: 0 },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
    // THE FIX: Yeh field ab "availabilities" ki jagah "weeklyAvailability" hai
    // aur yeh references (ObjectId) ki jagah poore objects ko store karta hai.
    weeklyAvailability: [AvailabilityRuleSchema],
    // Clinic-specific fields
    clinicName: { type: String },
    clinicAddress: { type: String },
    clinicPhone: { type: String },
    watermarkImageUrl: { type: String },
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;

