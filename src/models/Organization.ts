// models/Organization.ts
import { Schema, model, models, Document } from "mongoose";

export interface IOrganization extends Document {
  clerkOrgId?: string; // Clerk organization ID (optional)
  name: string;
  slug?: string;
  type?: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME";
  status: "PENDING" | "ACTIVE" | "DISABLED" | "REJECTED";
  owner?: Schema.Types.ObjectId; // Reference to the User who created it
  members: Schema.Types.ObjectId[]; // Array of all members (including owner) in the organization
  subscription?: Schema.Types.ObjectId; // Reference to the Subscription
  settings?: {
    timezone?: string;
    locale?: string;
    branding?: {
      logoUrl?: string;
      primaryColor?: string;
    };
  };
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    clerkOrgId: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
    name: { type: String, required: true },
    slug: { type: String },
    type: {
      type: String,
      enum: ["CLINIC", "HOSPITAL", "PRIVATE_PRACTICE", "NURSING_HOME"],
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "DISABLED", "REJECTED"],
      default: "PENDING",
    },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    subscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
    settings: {
      timezone: { type: String },
      locale: { type: String },
      branding: {
        logoUrl: { type: String },
        primaryColor: { type: String },
      },
    },
  },
  { timestamps: true }
);

// Index for efficient queries on members
OrganizationSchema.index({ members: 1 });

const Organization = models.Organization || model<IOrganization>("Organization", OrganizationSchema);
export default Organization;