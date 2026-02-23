import { Schema, model, models, Document } from "mongoose";

export interface IOnboardingRequest extends Document {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;

  // Organization Information
  organizationName: string;
  organizationType: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME";
  
  // Documents
  registrationDocument?: string;        // URL or base64
  licenseDocument?: string;             // URL or base64
  
  // Treatments/Services
  treatments: string[];                 // Array of treatment names
  
  // Additional Details
  yearsOfExperience?: number;
  specialty?: string;
  staffCount?: number;
  operatingHours?: string;
  
  // Status
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: Schema.Types.ObjectId;   // Reference to SuperAdmin User
  approvalDate?: Date;
  rejectionReason?: string;
  
  // Clerk Integration
  clerkUserId?: string;                 // After approval
  createdAt: Date;
  updatedAt: Date;
}

const OnboardingRequestSchema = new Schema<IOnboardingRequest>(
  {
    firstName: { 
      type: String, 
      required: [true, "First name is required"],
      trim: true 
    },
    lastName: { 
      type: String, 
      required: [true, "Last name is required"],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    phone: { 
      type: String, 
      required: [true, "Phone number is required"],
      trim: true 
    },
    address: { 
      type: String, 
      required: [true, "Address is required"],
      trim: true 
    },
    organizationName: { 
      type: String, 
      required: [true, "Organization/Clinic name is required"],
      trim: true 
    },
    organizationType: {
      type: String,
      enum: ["CLINIC", "HOSPITAL", "PRIVATE_PRACTICE", "NURSING_HOME"],
      required: [true, "Organization type is required"]
    },
    registrationDocument: { 
      type: String,
      // Optional - can be URL or base64
    },
    licenseDocument: { 
      type: String,
      // Optional
    },
    treatments: [{
      type: String,
      trim: true
    }],
    yearsOfExperience: { 
      type: Number,
      min: 0
    },
    specialty: { 
      type: String,
      trim: true
    },
    staffCount: { 
      type: Number,
      min: 0
    },
    operatingHours: { 
      type: String,
      // e.g., "09:00 - 17:00"
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },
    approvedBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User"
    },
    approvalDate: { 
      type: Date 
    },
    rejectionReason: { 
      type: String 
    },
    clerkUserId: { 
      type: String,
      sparse: true
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for efficient queries
OnboardingRequestSchema.index({ createdAt: -1 });

const OnboardingRequest = models.OnboardingRequest || 
  model<IOnboardingRequest>("OnboardingRequest", OnboardingRequestSchema);

export default OnboardingRequest;
