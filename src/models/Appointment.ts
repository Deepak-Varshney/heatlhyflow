// models/Appointment.ts

import { Schema, model, models, Document } from "mongoose";

export interface IAppointment extends Document {
  patient: Schema.Types.ObjectId;
  doctor: Schema.Types.ObjectId;
  organization: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
  prescription?: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId;
  // Pricing fields
  treatments?: Array<{
    treatment: Schema.Types.ObjectId;
    name: string;
    price: number;
  }>;
  doctorFee?: number;
  discount?: number;
  totalAmount?: number;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    // Reference to the exact slot that was booked
    // We store startTime/endTime here too for faster queries
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    reason: {
      type: String,
      trim: true,
    },
    prescription: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // Pricing fields
    treatments: [{
      treatment: { type: Schema.Types.ObjectId, ref: 'Treatment' },
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
    }],
    doctorFee: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalAmount: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = models.Appointment || model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;