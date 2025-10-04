// models/Patient.ts
import { Schema, model, models, Document } from "mongoose";

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  _id: Schema.Types.ObjectId | any
  appointments: [Schema.Types.ObjectId]; // Add reference to Appointments
  bp?: string;
  occupation?: string;
  weight?: string;
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
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, "Emergency contact name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Emergency contact phone is required"],
        trim: true,
      },
    },
    bp: {
      type: String, // Blood pressure as a string (e.g. '120/80')
    },
    weight: {
      type: String, // Weight as a string (e.g. '70kg')
    },
    occupation: {
      type: String, // Occupation as a string (e.g. 'Teacher')
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