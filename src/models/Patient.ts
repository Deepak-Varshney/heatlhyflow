// models/Patient.ts
import { Schema, model, models, Document } from "mongoose";

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email?: string;
  address?: string;
  emergencyContact?: {
    phone: string;
  };
  organization: Schema.Types.ObjectId;
  _id: Schema.Types.ObjectId | any
  appointments: [Schema.Types.ObjectId]; // Add reference to Appointments
  bp?: string;
  occupation?: string;
  weight?: number;
  medicalHistory?: string;
}

const PatientSchema = new Schema<IPatient>(
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
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined values while still enforcing uniqueness
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    address: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      phone: {
        type: String,
        trim: true,
      },
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    bp: {
      type: String, // Blood pressure as a string (e.g. '120/80')
    },
    weight: {
      type: Number, 
    },
    occupation: {
      type: String, // Occupation as a string (e.g. 'Teacher')
    },
    medicalHistory: {
      type: String,
      trim: true,
    },
    appointments: [
      { type: Schema.Types.ObjectId, ref: 'Appointment' }, // Reference to Appointments model
    ],
  },

  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Patient = models.Patient || model<IPatient>("Patient", PatientSchema);

export default Patient;