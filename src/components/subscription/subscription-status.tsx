"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { SubscriptionContext } from "@/lib/subscription";
import { SUBSCRIPTION_PLANS } from "@/types/subscription";

interface SubscriptionStatusProps {
  subscription: SubscriptionContext | null;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No subscription found. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  const plan = SUBSCRIPTION_PLANS[subscription.subscription?.planType || "FREE"];
  const isActive = subscription.isActive;
  const daysUntilExpiry = subscription.daysUntilExpiry;

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  const getStatusColor = () => {
    if (!isActive) return "text-red-600";
    if (daysUntilExpiry <= 7) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusIcon = () => {
    if (!isActive) return <AlertTriangle className="h-4 w-4" />;
    if (daysUntilExpiry <= 7) return <Clock className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
              <CardDescription>
                {subscription.organization?.name || "Organization"}
              </CardDescription>
            </div>
            <Badge 
              variant={isActive ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {getStatusIcon()}
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{plan.name}</div>
              <div className="text-sm text-muted-foreground">Plan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${subscription.subscription?.pricePerMonth || 0}
              </div>
              <div className="text-sm text-muted-foreground">Per Month</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {daysUntilExpiry}
              </div>
              <div className="text-sm text-muted-foreground">Days Left</div>
            </div>
          </div>
          
          {!isActive && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your subscription is inactive. Please update your payment method or contact support.
              </AlertDescription>
            </Alert>
          )}
          
          {isActive && daysUntilExpiry <= 7 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your subscription expires in {daysUntilExpiry} days. Please renew to avoid service interruption.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Statistics
          </CardTitle>
          <CardDescription>
            Current usage against your plan limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Users Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Users</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {subscription.usage.currentUsers} / {plan.features.maxUsers === -1 ? "∞" : plan.features.maxUsers}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(subscription.usage.currentUsers, plan.features.maxUsers)}
              className="h-2"
            />
          </div>

          {/* Appointments Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Appointments</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {subscription.usage.currentAppointments} / {plan.features.maxAppointments === -1 ? "∞" : plan.features.maxAppointments}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(subscription.usage.currentAppointments, plan.features.maxAppointments)}
              className="h-2"
            />
          </div>

          {/* Patients Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Patients</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {subscription.usage.currentPatients} / {plan.features.maxPatients === -1 ? "∞" : plan.features.maxPatients}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(subscription.usage.currentPatients, plan.features.maxPatients)}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Access */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Access</CardTitle>
          <CardDescription>
            Features available in your current plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${subscription.limits.canAccessAnalytics ? "text-green-500" : "text-gray-400"}`} />
              <span className="text-sm">Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${subscription.limits.canUseCustomBranding ? "text-green-500" : "text-gray-400"}`} />
              <span className="text-sm">Custom Branding</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${subscription.limits.canUseApiAccess ? "text-green-500" : "text-gray-400"}`} />
              <span className="text-sm">API Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${subscription.limits.canUsePrioritySupport ? "text-green-500" : "text-gray-400"}`} />
              <span className="text-sm">Priority Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${subscription.limits.canUseCustomIntegrations ? "text-green-500" : "text-gray-400"}`} />
              <span className="text-sm">Custom Integrations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}