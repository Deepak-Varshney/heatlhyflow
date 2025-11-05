import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { 
  SubscriptionLimits, 
  SubscriptionUsage, 
  SUBSCRIPTION_PLANS,
  SubscriptionPlan 
} from "@/types/subscription";

export interface ClerkSubscriptionContext {
  subscription: any;
  organization: any;
  limits: SubscriptionLimits;
  usage: SubscriptionUsage;
  isActive: boolean;
  daysUntilExpiry: number;
  canAccess: boolean;
  planType: SubscriptionPlan;
}

/**
 * Get subscription information using Clerk's subscription system
 */
export const getClerkSubscriptionContext = async (): Promise<ClerkSubscriptionContext | null> => {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connectDB();

    // Get user and their organization
    const user = await User.findOne({ clerkUserId: userId }).populate('organization');
    if (!user || !user.organization) return null;

    // For now, we'll use the organization from MongoDB
    // Clerk subscription integration would need to be implemented separately
    // using Clerk's organization API or webhooks
    // TODO: Integrate with Clerk subscription API to get actual subscription data
    
    // Default to FREE plan for now
    const planType: SubscriptionPlan = "FREE";

    // Get plan details
    const planDetails = SUBSCRIPTION_PLANS[planType];

    // Get current usage
    const usage = await getCurrentUsage(user.organization._id);

    // Check if subscription is active (FREE plan is always active)
    const isActive = true; // FREE plan is always active

    // Get subscription limits
    const limits = checkSubscriptionLimits(planDetails, usage);

    // Free plan doesn't expire
    const daysUntilExpiry = 365;

    return {
      subscription: {
        planType,
        features: planDetails.features,
        pricePerMonth: planDetails.price.monthly,
      },
      organization: user.organization,
      limits,
      usage,
      isActive,
      daysUntilExpiry,
      canAccess: isActive && limits.canCreateUser,
      planType,
    };
  } catch (error) {
    console.error("Error getting Clerk subscription context:", error);
    return null;
  }
};

/**
 * Get current usage statistics for an organization
 */
export const getCurrentUsage = async (organizationId: string): Promise<SubscriptionUsage> => {
  try {
    await connectDB();

    const userCount = await User.countDocuments({ organization: organizationId });
    
    // You'll need to adjust these based on your actual models
    // const appointmentCount = await Appointment.countDocuments({ organization: organizationId });
    // const patientCount = await Patient.countDocuments({ organization: organizationId });

    return {
      currentUsers: userCount,
      currentAppointments: 0, // Replace with actual count
      currentPatients: 0, // Replace with actual count
    };
  } catch (error) {
    console.error("Error getting current usage:", error);
    return {
      currentUsers: 0,
      currentAppointments: 0,
      currentPatients: 0,
    };
  }
};

/**
 * Check subscription limits based on plan features
 */
export const checkSubscriptionLimits = (
  planFeatures: any,
  usage: SubscriptionUsage
): SubscriptionLimits => {
  return {
    canCreateUser: planFeatures.maxUsers === -1 || usage.currentUsers < planFeatures.maxUsers,
    canCreateAppointment: planFeatures.maxAppointments === -1 || usage.currentAppointments < planFeatures.maxAppointments,
    canCreatePatient: planFeatures.maxPatients === -1 || usage.currentPatients < planFeatures.maxPatients,
    canAccessAnalytics: planFeatures.advancedAnalytics,
    canUseCustomBranding: planFeatures.customBranding,
    canUseApiAccess: planFeatures.apiAccess,
    canUsePrioritySupport: planFeatures.prioritySupport,
    canUseCustomIntegrations: planFeatures.customIntegrations,
  };
};

/**
 * Check if user can perform a specific action based on subscription limits
 */
export const canPerformAction = async (
  action: keyof SubscriptionLimits
): Promise<boolean> => {
  const context = await getClerkSubscriptionContext();
  if (!context) return false;

  return context.limits[action] && context.isActive;
};

/**
 * Check if user has access to a specific feature
 */
export const hasFeatureAccess = async (
  feature: keyof SubscriptionLimits
): Promise<boolean> => {
  const context = await getClerkSubscriptionContext();
  if (!context) return false;

  return context.limits[feature] && context.isActive;
};

/**
 * Get subscription status for middleware
 */
export const getSubscriptionStatus = async (): Promise<{
  isActive: boolean;
  planType: SubscriptionPlan;
  limits: SubscriptionLimits;
}> => {
  const context = await getClerkSubscriptionContext();
  
  if (!context) {
    return {
      isActive: false,
      planType: "FREE",
      limits: {
        canCreateUser: false,
        canCreateAppointment: false,
        canCreatePatient: false,
        canAccessAnalytics: false,
        canUseCustomBranding: false,
        canUseApiAccess: false,
        canUsePrioritySupport: false,
        canUseCustomIntegrations: false,
      },
    };
  }

  return {
    isActive: context.isActive,
    planType: context.planType,
    limits: context.limits,
  };
};

/**
 * Update usage statistics for an organization
 */
export const updateUsage = async (
  organizationId: string,
  usageType: 'users' | 'appointments' | 'patients',
  increment: boolean = true
): Promise<void> => {
  try {
    await connectDB();

    // For Clerk subscriptions, we don't need to update a local subscription model
    // We can track usage in a separate collection or in the organization model
    // This is just a placeholder for usage tracking
    console.log(`Usage update: ${usageType} ${increment ? 'incremented' : 'decremented'} for org ${organizationId}`);
  } catch (error) {
    console.error("Error updating usage:", error);
  }
};