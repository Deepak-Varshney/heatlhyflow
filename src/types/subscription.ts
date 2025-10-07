export type SubscriptionPlan = "FREE" | "BASIC" | "PROFESSIONAL" | "ENTERPRISE";

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE";

export type BillingCycle = "MONTHLY" | "YEARLY";

export interface SubscriptionFeatures {
  maxUsers: number;
  maxAppointments: number;
  maxPatients: number;
  advancedAnalytics: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  customIntegrations: boolean;
}

export interface SubscriptionUsage {
  currentUsers: number;
  currentAppointments: number;
  currentPatients: number;
}

export interface SubscriptionLimits {
  canCreateUser: boolean;
  canCreateAppointment: boolean;
  canCreatePatient: boolean;
  canAccessAnalytics: boolean;
  canUseCustomBranding: boolean;
  canUseApiAccess: boolean;
  canUsePrioritySupport: boolean;
  canUseCustomIntegrations: boolean;
}

export interface PlanDetails {
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: SubscriptionFeatures;
  popular?: boolean;
  clerkSlug?: string; // Clerk plan slug
}

// Updated plans to match your Clerk setup
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, PlanDetails> = {
  FREE: {
    name: "Free",
    description: "Perfect for small practices getting started",
    price: {
      monthly: 0,
      yearly: 0,
    },
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
  },
  BASIC: {
    name: "Basic",
    description: "Essential features for growing practices",
    price: {
      monthly: 10, // Updated to match your Clerk plan
      yearly: 100, // Assuming yearly discount
    },
    features: {
      maxUsers: 5,
      maxAppointments: 200,
      maxPatients: 500,
      advancedAnalytics: false,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
      customIntegrations: false,
    },
    clerkSlug: "basic", // Your Clerk plan slug
  },
  PROFESSIONAL: {
    name: "Professional",
    description: "Advanced features for established practices",
    price: {
      monthly: 79,
      yearly: 790,
    },
    features: {
      maxUsers: 15,
      maxAppointments: 1000,
      maxPatients: 2000,
      advancedAnalytics: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: false,
      customIntegrations: false,
    },
    popular: true,
  },
  ENTERPRISE: {
    name: "Enterprise",
    description: "Complete solution for large healthcare organizations",
    price: {
      monthly: 199,
      yearly: 1990,
    },
    features: {
      maxUsers: -1, // Unlimited
      maxAppointments: -1, // Unlimited
      maxPatients: -1, // Unlimited
      advancedAnalytics: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
      customIntegrations: true,
    },
  },
};

export const checkSubscriptionLimits = (
  subscription: any,
  usage: SubscriptionUsage
): SubscriptionLimits => {
  const features = subscription?.features || SUBSCRIPTION_PLANS.FREE.features;
  const currentUsage = subscription?.usage || usage;

  return {
    canCreateUser: features.maxUsers === -1 || currentUsage.currentUsers < features.maxUsers,
    canCreateAppointment: features.maxAppointments === -1 || currentUsage.currentAppointments < features.maxAppointments,
    canCreatePatient: features.maxPatients === -1 || currentUsage.currentPatients < features.maxPatients,
    canAccessAnalytics: features.advancedAnalytics,
    canUseCustomBranding: features.customBranding,
    canUseApiAccess: features.apiAccess,
    canUsePrioritySupport: features.prioritySupport,
    canUseCustomIntegrations: features.customIntegrations,
  };
};

export const isSubscriptionActive = (subscription: any): boolean => {
  if (!subscription) return false;
  
  const activeStatuses: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];
  return activeStatuses.includes(subscription.status) && 
         new Date(subscription.currentPeriodEnd) > new Date();
};

export const isSubscriptionExpired = (subscription: any): boolean => {
  if (!subscription) return true;
  
  return subscription.status === "CANCELLED" || 
         subscription.status === "PAST_DUE" ||
         new Date(subscription.currentPeriodEnd) <= new Date();
};

export const getDaysUntilExpiry = (subscription: any): number => {
  if (!subscription || !subscription.currentPeriodEnd) return 0;
  
  const now = new Date();
  const expiry = new Date(subscription.currentPeriodEnd);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};