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
// Test ke liye naya, detailed sub-schema
interface ITest {
  name: string;
  notes?: string;       // Har test ke liye alag notes
  reportImageUrl?: string; // Report ki image ka URL
}

export interface IPrescription extends Document {
  appointment: Schema.Types.ObjectId;
  patient: Schema.Types.ObjectId;
  doctor: Schema.Types.ObjectId;
  organization: Schema.Types.ObjectId;
  medicines: IMedicine[];
  chiefComplaint: string; // Patient ki samasya
  diagnosis: string;      // Doctor ka nirdharan
  tests: ITest[]; // Ab yeh naye ITest type ka array hoga
  notes?: string;
}
const TestSchema = new Schema<ITest>({
  name: { type: String, required: true },
  notes: { type: String },
  reportImageUrl: { type: String },
}, { _id: false });


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
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    medicines: [MedicineSchema],
    chiefComplaint: { type: String, required: true },
    diagnosis: { type: String, required: true },
    notes: { type: String },
    tests: [TestSchema], // Yahan naye TestSchema ka istemaal karein
  },
  { timestamps: true }
);

const Prescription = models.Prescription || model<IPrescription>("Prescription", PrescriptionSchema);
export default Prescription;