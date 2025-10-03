// models/Appointment.ts

import { Schema, model, models, Document } from "mongoose";

export interface IAppointment extends Document {
  patient: Schema.Types.ObjectId;
  doctor: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
  prescription?: Schema.Types.ObjectId;
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
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
AppointmentSchema.index({ doctor: 1, startTime: 1 });
AppointmentSchema.index({ patient: 1, startTime: 1 });

const Appointment = models.Appointment || model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;