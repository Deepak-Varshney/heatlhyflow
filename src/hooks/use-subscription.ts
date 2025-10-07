"use client";

import { useState, useEffect } from "react";
import { SubscriptionContext } from "@/lib/subscription";

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, this would make an API call
        // For now, we'll simulate the data
        const mockSubscription: SubscriptionContext = {
          subscription: {
            _id: "mock-id",
            organization: "mock-org-id",
            clerkOrgId: "mock-clerk-org",
            planType: "BASIC",
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false,
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
            usage: {
              currentUsers: 3,
              currentAppointments: 45,
              currentPatients: 120,
            },
            billingCycle: "MONTHLY",
            pricePerMonth: 29,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          organization: {
            _id: "mock-org-id",
            clerkOrgId: "mock-clerk-org",
            name: "Sample Clinic",
            status: "ACTIVE",
            owner: "mock-owner-id",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          limits: {
            canCreateUser: true,
            canCreateAppointment: true,
            canCreatePatient: true,
            canAccessAnalytics: false,
            canUseCustomBranding: false,
            canUseApiAccess: false,
            canUsePrioritySupport: false,
            canUseCustomIntegrations: false,
          },
          usage: {
            currentUsers: 3,
            currentAppointments: 45,
            currentPatients: 120,
          },
          isActive: true,
          daysUntilExpiry: 15,
          canAccess: true,
        };

        setSubscription(mockSubscription);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch subscription");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const canPerformAction = (action: keyof typeof subscription.limits): boolean => {
    if (!subscription) return false;
    return subscription.limits[action] && subscription.isActive;
  };

  const isFeatureAvailable = (feature: keyof typeof subscription.limits): boolean => {
    if (!subscription) return false;
    return subscription.limits[feature];
  };

  const getUsagePercentage = (type: "users" | "appointments" | "patients"): number => {
    if (!subscription) return 0;
    
    const current = subscription.usage[`current${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof subscription.usage] as number;
    const max = subscription.subscription.features[`max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof subscription.subscription.features] as number;
    
    if (max === -1) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  const isNearLimit = (type: "users" | "appointments" | "patients", threshold: number = 80): boolean => {
    return getUsagePercentage(type) >= threshold;
  };

  const isAtLimit = (type: "users" | "appointments" | "patients"): boolean => {
    if (!subscription) return false;
    
    const current = subscription.usage[`current${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof subscription.usage] as number;
    const max = subscription.subscription.features[`max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof subscription.subscription.features] as number;
    
    if (max === -1) return false; // Unlimited
    return current >= max;
  };

  const refreshSubscription = async () => {
    // This would refetch the subscription data
    // For now, we'll just trigger a re-render
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return {
    subscription,
    isLoading,
    error,
    canPerformAction,
    isFeatureAvailable,
    getUsagePercentage,
    isNearLimit,
    isAtLimit,
    refreshSubscription,
  };
}