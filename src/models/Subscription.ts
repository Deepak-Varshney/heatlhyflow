import { Schema, model, models, Document } from "mongoose";

export interface ISubscription extends Document {
  organization: Schema.Types.ObjectId; // Reference to Organization
  clerkOrgId: string; // Clerk organization ID
  planType: "FREE" | "BASIC" | "PROFESSIONAL" | "ENTERPRISE";
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialStart?: Date;
  trialEnd?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  features: {
    maxUsers: number;
    maxAppointments: number;
    maxPatients: number;
    advancedAnalytics: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    customIntegrations: boolean;
  };
  usage: {
    currentUsers: number;
    currentAppointments: number;
    currentPatients: number;
  };
  billingCycle: "MONTHLY" | "YEARLY";
  pricePerMonth: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    organization: { 
      type: Schema.Types.ObjectId, 
      ref: "Organization", 
      required: true,
      unique: true 
    },
    clerkOrgId: { type: String, required: true, unique: true },
    planType: {
      type: String,
      enum: ["FREE", "BASIC", "PROFESSIONAL", "ENTERPRISE"],
      default: "FREE",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "PAST_DUE", "TRIALING", "INCOMPLETE"],
      default: "ACTIVE",
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    trialStart: { type: Date },
    trialEnd: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    features: {
      maxUsers: { type: Number, default: 5 },
      maxAppointments: { type: Number, default: 100 },
      maxPatients: { type: Number, default: 200 },
      advancedAnalytics: { type: Boolean, default: false },
      customBranding: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
      customIntegrations: { type: Boolean, default: false },
    },
    usage: {
      currentUsers: { type: Number, default: 0 },
      currentAppointments: { type: Number, default: 0 },
      currentPatients: { type: Number, default: 0 },
    },
    billingCycle: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      default: "MONTHLY",
    },
    pricePerMonth: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for efficient queries (organization and clerkOrgId indexes created automatically by unique: true)
SubscriptionSchema.index({ status: 1 });

const Subscription = models.Subscription || model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;