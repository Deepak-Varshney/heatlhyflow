// models/Treatment.ts
import { Schema, model, models, Document } from "mongoose";

export interface ITreatment extends Document {
  name: string;
  price: number;
  doctor: Schema.Types.ObjectId;
  organization: Schema.Types.ObjectId;
  isActive: boolean;
}

const TreatmentSchema = new Schema<ITreatment>(
  {
    name: {
      type: String,
      required: [true, "Treatment name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Treatment price is required"],
      min: [0, "Price cannot be negative"],
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
TreatmentSchema.index({ doctor: 1, isActive: 1 });

const Treatment = models.Treatment || model<ITreatment>("Treatment", TreatmentSchema);

export default Treatment;

