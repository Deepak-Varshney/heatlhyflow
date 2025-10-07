// models/Organization.ts
import { Schema, model, models, Document } from "mongoose";

export interface IOrganization extends Document {
  clerkOrgId: string;
  name: string;
  status: "PENDING" | "ACTIVE" | "DISABLED" | "REJECTED";
  owner: Schema.Types.ObjectId; // Reference to the User who created it
  subscription?: Schema.Types.ObjectId; // Reference to the Subscription
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    clerkOrgId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "DISABLED", "REJECTED"],
      default: "PENDING",
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Organization = models.Organization || model<IOrganization>("Organization", OrganizationSchema);
export default Organization;