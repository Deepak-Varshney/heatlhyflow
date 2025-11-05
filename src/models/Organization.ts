// models/Organization.ts
import { Schema, model, models, Document } from "mongoose";

export interface IOrganization extends Document {
  clerkOrgId: string;
  name: string;
  status: "PENDING" | "ACTIVE" | "DISABLED" | "REJECTED";
  owner: Schema.Types.ObjectId; // Reference to the User who created it
  members: Schema.Types.ObjectId[]; // Array of all members (including owner) in the organization
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
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Index for efficient queries
OrganizationSchema.index({ clerkOrgId: 1 });
OrganizationSchema.index({ members: 1 });

const Organization = models.Organization || model<IOrganization>("Organization", OrganizationSchema);
export default Organization;