// models/Prescription.ts
import { Schema, model, models, Document } from "mongoose";

interface IMedicine {
  name: string;
  dosage: string; // e.g., "500mg", "1 tablet"
  timings: {
    beforeBreakfast: boolean;
    afterBreakfast: boolean;
    beforeLunch: boolean;
    afterLunch: boolean;
    beforeDinner: boolean;
    afterDinner: boolean;
  };
}
// Test ke liye naya, detailed sub-schema
interface ITest {
  name: string;
  notes?: string;       // Har test ke liye alag notes
  reportImageUrl?: string; // Report ki image ka URL
  price?: number;       // Test price
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
  price: { type: Number, min: 0 },
}, { _id: false });


const MedicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timings: {
    beforeBreakfast: { type: Boolean, default: false },
    afterBreakfast: { type: Boolean, default: false },
    beforeLunch: { type: Boolean, default: false },
    afterLunch: { type: Boolean, default: false },
    beforeDinner: { type: Boolean, default: false },
    afterDinner: { type: Boolean, default: false },
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