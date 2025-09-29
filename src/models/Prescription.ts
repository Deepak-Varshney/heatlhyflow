// models/Prescription.ts
import { Schema, model, models, Document } from "mongoose";

interface IMedicine {
  name: string;
  dosage: string; // e.g., "500mg", "1 tablet"
  timings: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
}

export interface IPrescription extends Document {
  appointment: Schema.Types.ObjectId;
  patient: Schema.Types.ObjectId;
  doctor: Schema.Types.ObjectId;
  medicines: IMedicine[];
  tests: string[]; // e.g., ["Complete Blood Count", "X-Ray"]
  notes?: string;
}

const MedicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timings: {
    morning: { type: Boolean, default: false },
    afternoon: { type: Boolean, default: false },
    night: { type: Boolean, default: false },
  },
});

const PrescriptionSchema = new Schema<IPrescription>(
  {
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming Doctor is a User
    medicines: [MedicineSchema],
    tests: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true }
);

const Prescription = models.Prescription || model<IPrescription>("Prescription", PrescriptionSchema);
export default Prescription;