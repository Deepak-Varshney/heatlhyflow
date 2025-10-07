"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap, Star } from "lucide-react";
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/types/subscription";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  planType: SubscriptionPlan;
  currentPlan?: SubscriptionPlan;
  onSelect?: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
  className?: string;
}

export function SubscriptionCard({ 
  planType, 
  currentPlan, 
  onSelect, 
  isLoading = false,
  className 
}: SubscriptionCardProps) {
  const plan = SUBSCRIPTION_PLANS[planType];
  const isCurrentPlan = currentPlan === planType;
  const isPopular = plan.popular;

  const getIcon = () => {
    switch (planType) {
      case "FREE":
        return <Star className="h-6 w-6" />;
      case "BASIC":
        return <Zap className="h-6 w-6" />;
      case "PROFESSIONAL":
        return <Crown className="h-6 w-6" />;
      case "ENTERPRISE":
        return <Crown className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPriceDisplay = () => {
    if (planType === "FREE") return "Free";
    return `$${plan.price.monthly}/month`;
  };

  return (
    <Card 
      className={cn(
        "relative transition-all duration-200 hover:shadow-lg",
        isCurrentPlan && "ring-2 ring-primary",
        isPopular && "border-primary shadow-lg",
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          {getIcon()}
        </div>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
        <div className="mt-4">
          <div className="text-3xl font-bold">{getPriceDisplay()}</div>
          {planType !== "FREE" && (
            <div className="text-sm text-muted-foreground">
              or ${plan.price.yearly}/year (save ${(plan.price.monthly * 12) - plan.price.yearly})
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              {plan.features.maxUsers === -1 ? "Unlimited" : plan.features.maxUsers} users
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              {plan.features.maxAppointments === -1 ? "Unlimited" : plan.features.maxAppointments} appointments
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              {plan.features.maxPatients === -1 ? "Unlimited" : plan.features.maxPatients} patients
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {plan.features.advancedAnalytics ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm">Advanced Analytics</span>
          </div>
          
          <div className="flex items-center gap-2">
            {plan.features.customBranding ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm">Custom Branding</span>
          </div>
          
          <div className="flex items-center gap-2">
            {plan.features.apiAccess ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm">API Access</span>
          </div>
          
          <div className="flex items-center gap-2">
            {plan.features.prioritySupport ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm">Priority Support</span>
          </div>
          
          <div className="flex items-center gap-2">
            {plan.features.customIntegrations ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm">Custom Integrations</span>
          </div>
        </div>
        
        <div className="pt-4">
          {isCurrentPlan ? (
            <Button className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => onSelect?.(planType)}
              disabled={isLoading}
              variant={isPopular ? "default" : "outline"}
            >
              {isLoading ? "Processing..." : `Select ${plan.name}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface SubscriptionGridProps {
  currentPlan?: SubscriptionPlan;
  onSelect?: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

export function SubscriptionGrid({ currentPlan, onSelect, isLoading }: SubscriptionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SubscriptionCard 
        planType="FREE" 
        currentPlan={currentPlan}
        onSelect={onSelect}
        isLoading={isLoading}
      />
      <SubscriptionCard 
        planType="BASIC" 
        currentPlan={currentPlan}
        onSelect={onSelect}
        isLoading={isLoading}
      />
      <SubscriptionCard 
        planType="PROFESSIONAL" 
        currentPlan={currentPlan}
        onSelect={onSelect}
        isLoading={isLoading}
      />
      <SubscriptionCard 
        planType="ENTERPRISE" 
        currentPlan={currentPlan}
        onSelect={onSelect}
        isLoading={isLoading}
      />
    </div>
  );
}