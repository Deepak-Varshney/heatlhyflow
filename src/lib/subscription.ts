import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { 
  SubscriptionLimits, 
  SubscriptionUsage, 
  isSubscriptionActive, 
  checkSubscriptionLimits,
  getDaysUntilExpiry 
} from "@/types/subscription";

export interface SubscriptionContext {
  subscription: any;
  organization: any;
  limits: SubscriptionLimits;
  usage: SubscriptionUsage;
  isActive: boolean;
  daysUntilExpiry: number;
  canAccess: boolean;
}

/**
 * Get subscription information for the current user's organization
 */
export const getSubscriptionContext = async (): Promise<SubscriptionContext | null> => {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connectDB();

    // Get user and their organization
    const user = await User.findOne({ clerkUserId: userId }).populate('organization');
    if (!user || !user.organization) return null;

    // Get subscription for the organization
    const subscription = await Subscription.findOne({ 
      organization: user.organization._id 
    });

    // Get current usage
    const usage = await getCurrentUsage(user.organization._id);

    // Check if subscription is active
    const isActive = isSubscriptionActive(subscription);

    // Get subscription limits
    const limits = checkSubscriptionLimits(subscription, usage);

    // Get days until expiry
    const daysUntilExpiry = getDaysUntilExpiry(subscription);

    return {
      subscription,
      organization: user.organization,
      limits,
      usage,
      isActive,
      daysUntilExpiry,
      canAccess: isActive && limits.canCreateUser, // Basic access check
    };
  } catch (error) {
    console.error("Error getting subscription context:", error);
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
 * Check if user can perform a specific action based on subscription limits
 */
export const canPerformAction = async (
  action: keyof SubscriptionLimits
): Promise<boolean> => {
  const context = await getSubscriptionContext();
  if (!context) return false;

  return context.limits[action] && context.isActive;
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

    const updateField = `usage.current${usageType.charAt(0).toUpperCase() + usageType.slice(1)}`;
    const updateValue = increment ? 1 : -1;

    await Subscription.findOneAndUpdate(
      { organization: organizationId },
      { $inc: { [updateField]: updateValue } }
    );
  } catch (error) {
    console.error("Error updating usage:", error);
  }
};

/**
 * Create a default free subscription for a new organization
 */
export const createDefaultSubscription = async (organizationId: string, clerkOrgId: string): Promise<void> => {
  try {
    await connectDB();

    const now = new Date();
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    await Subscription.create({
      organization: organizationId,
      clerkOrgId,
      planType: "FREE",
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: oneYearFromNow,
      cancelAtPeriodEnd: false,
      features: {
        maxUsers: 2,
        maxAppointments: 50,
        maxPatients: 100,
        advancedAnalytics: false,
        customBranding: false,
        apiAccess: false,
        prioritySupport: false,
        customIntegrations: false,
      },
      usage: {
        currentUsers: 0,
        currentAppointments: 0,
        currentPatients: 0,
      },
      billingCycle: "MONTHLY",
      pricePerMonth: 0,
    });
  } catch (error) {
    console.error("Error creating default subscription:", error);
  }
};

/**
 * Middleware helper to check subscription access
 */
export const requireActiveSubscription = async (): Promise<boolean> => {
  const context = await getSubscriptionContext();
  return context?.isActive || false;
};

/**
 * Middleware helper to check specific feature access
 */
export const requireFeatureAccess = async (feature: keyof SubscriptionLimits): Promise<boolean> => {
  const context = await getSubscriptionContext();
  return context?.limits[feature] && context.isActive || false;
};