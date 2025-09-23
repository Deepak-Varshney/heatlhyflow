// models/Appointment.ts
import { Schema, model, models, Document } from "mongoose";

export interface IAppointment extends Document {
  patient: Schema.Types.ObjectId;  // Reference to the Patient model
  date: Date;                      // Date and time of the appointment
  doctorName: string;              // Doctor handling the appointment
  reasonForVisit: string;          // Reason for the visit
  status: "Scheduled" | "Completed" | "Cancelled"; // Appointment status
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, required: true },
    doctorName: { type: String, required: true },
    reasonForVisit: { type: String, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
AppointmentSchema.index({ patient: 1 });
AppointmentSchema.index({ date: 1 });

const Appointment = models.Appointment || model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
