// models/Doctor.ts

import { Schema, model, models, Document } from "mongoose";

export interface IDoctor extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  appointments: Schema.Types.ObjectId[];
  _id: Schema.Types.ObjectId|any;
  
}

const DoctorSchema = new Schema<IDoctor>(
  {
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
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    appointments: [
      { type: Schema.Types.ObjectId, ref: 'Appointment' }, // Reference to the Appointment model
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexes for efficient searching
DoctorSchema.index({ email: 1 });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ lastName: 1, firstName: 1 });


const Doctor = models.Doctor || model<IDoctor>("Doctor", DoctorSchema);

export default Doctor;