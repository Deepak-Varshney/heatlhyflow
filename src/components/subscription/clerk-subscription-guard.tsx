"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Lock, 
  Crown, 
  Users, 
  Calendar,
  BarChart3,
  CreditCard,
  Zap,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

interface FeatureRequirement {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPlan: string;
}

const FEATURE_REQUIREMENTS: Record<string, FeatureRequirement> = {
  analytics: {
    name: "Advanced Analytics",
    description: "Access detailed reports and insights about your practice",
    icon: BarChart3,
    requiredPlan: "Professional"
  },
  api: {
    name: "API Access",
    description: "Integrate with third-party applications and services",
    icon: Zap,
    requiredPlan: "Professional"
  },
  branding: {
    name: "Custom Branding",
    description: "Customize the appearance with your practice's branding",
    icon: Crown,
    requiredPlan: "Professional"
  },
  unlimited_users: {
    name: "Unlimited Users",
    description: "Add unlimited team members to your practice",
    icon: Users,
    requiredPlan: "Enterprise"
  },
  unlimited_appointments: {
    name: "Unlimited Appointments",
    description: "Schedule unlimited appointments without restrictions",
    icon: Calendar,
    requiredPlan: "Enterprise"
  },
  priority_support: {
    name: "Priority Support",
    description: "Get priority support with faster response times",
    icon: CreditCard,
    requiredPlan: "Enterprise"
  }
};

export function ClerkSubscriptionGuard({ 
  children, 
  feature, 
  fallback,
  showUpgrade = true 
}: SubscriptionGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would check the user's Clerk subscription
        // For now, we'll simulate a check based on the feature
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock logic - in real implementation, this would check actual Clerk subscription
        const mockHasAccess = Math.random() > 0.3; // 70% chance of having access for demo
        setHasAccess(mockHasAccess);
      } catch (error) {
        console.error("Error checking subscription:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [feature]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasAccess === false) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const requirement = FEATURE_REQUIREMENTS[feature];
    
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-muted">
              <requirement.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            {requirement.name}
          </CardTitle>
          <CardDescription>
            {requirement.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Badge variant="outline" className="text-sm">
            Requires {requirement.requiredPlan} Plan
          </Badge>
          
          {showUpgrade && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upgrade your plan to access this feature
              </p>
              <Link href="/billing">
                <Button className="w-full">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

interface UsageLimitProps {
  current: number;
  max: number;
  type: "users" | "appointments" | "patients";
  onUpgrade?: () => void;
}

export function ClerkUsageLimit({ current, max, type, onUpgrade }: UsageLimitProps) {
  const isAtLimit = current >= max;
  const percentage = max === -1 ? 0 : (current / max) * 100;

  const getTypeInfo = () => {
    switch (type) {
      case "users":
        return { label: "Users", icon: Users };
      case "appointments":
        return { label: "Appointments", icon: Calendar };
      case "patients":
        return { label: "Patients", icon: Users };
      default:
        return { label: "Items", icon: Users };
    }
  };

  const typeInfo = getTypeInfo();
  const Icon = typeInfo.icon;

  if (max === -1) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{current} {typeInfo.label} (Unlimited)</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{typeInfo.label}</span>
        </div>
        <span className={isAtLimit ? "text-red-600 font-medium" : "text-muted-foreground"}>
          {current} / {max}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${
            isAtLimit ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {isAtLimit && onUpgrade && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>You&apos;ve reached your {typeInfo.label} limit</span>
            <Button size="sm" onClick={onUpgrade}>
              Upgrade
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface ClerkSubscriptionBannerProps {
  subscription?: any;
  onUpgrade?: () => void;
}

export function ClerkSubscriptionBanner({ subscription, onUpgrade }: ClerkSubscriptionBannerProps) {
  if (!subscription) return null;

  const isExpiringSoon = subscription.daysUntilExpiry <= 7;
  const isExpired = subscription.daysUntilExpiry <= 0;

  if (!isExpiringSoon && !isExpired) return null;

  return (
    <Alert className={isExpired ? "border-red-500 bg-red-50" : "border-yellow-500 bg-yellow-50"}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          {isExpired 
            ? "Your subscription has expired. Please renew to continue using the service."
            : `Your subscription expires in ${subscription.daysUntilExpiry} days.`
          }
        </span>
        {onUpgrade && (
          <Button size="sm" onClick={onUpgrade}>
            {isExpired ? "Renew" : "Upgrade"}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}