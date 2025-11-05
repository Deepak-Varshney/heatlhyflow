import { getClerkSubscriptionContext } from "@/lib/clerk-subscription";
import { ClerkSubscriptionStatus } from "@/components/subscription/clerk-subscription-status";
import { SubscriptionGrid } from "@/components/subscription/subscription-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface BillingPageProps {
  searchParams?: Promise<{
    feature?: string;
  }>;
}

const BillingPage = async ({ searchParams }: BillingPageProps) => {
  const subscriptionContext = await getClerkSubscriptionContext();
  const resolvedSearchParams = await searchParams;
  
  const getFeatureMessage = (feature: string) => {
    switch (feature) {
      case "analytics":
        return "Advanced Analytics is available in Professional and Enterprise plans.";
      case "api":
        return "API Access is available in Professional and Enterprise plans.";
      case "branding":
        return "Custom Branding is available in Professional and Enterprise plans.";
      default:
        return "This feature requires a higher subscription plan.";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Billing & Subscription</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your subscription and access premium features for your healthcare practice
        </p>
      </div>

      {/* Feature Upgrade Alert */}
      {resolvedSearchParams?.feature && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {getFeatureMessage(resolvedSearchParams.feature)}
          </AlertDescription>
        </Alert>
      )}

      {/* Current Subscription Status */}
      {subscriptionContext ? (
        <ClerkSubscriptionStatus 
          subscription={subscriptionContext.subscription}
          organization={subscriptionContext.organization}
          usage={subscriptionContext.usage}
          limits={subscriptionContext.limits}
          isActive={subscriptionContext.isActive}
          daysUntilExpiry={subscriptionContext.daysUntilExpiry}
          planType={subscriptionContext.planType}
        />
      ) : (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No subscription found. Please contact support.
          </AlertDescription>
        </Alert>
      )}

      {/* Upgrade Options */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CreditCard className="h-6 w-6" />
            Choose Your Plan
          </CardTitle>
          <CardDescription>
            Upgrade to unlock more features and higher limits for your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionGrid 
            currentPlan={subscriptionContext?.subscription?.planType}
            onSelect={(plan) => {
              // This would typically redirect to a payment page or handle the upgrade
              console.log("Selected plan:", plan);
            }}
          />
        </CardContent>
      </Card>

      {/* Billing Information */}
      {subscriptionContext?.subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Manage your billing details and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Current Plan</h4>
                <p className="text-sm text-muted-foreground">
                  {subscriptionContext.subscription.planType} Plan
                </p>
              </div>
              <div>
                <h4 className="font-medium">Billing Cycle</h4>
                <p className="text-sm text-muted-foreground">
                  {subscriptionContext.subscription.billingCycle}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Next Billing Date</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(subscriptionContext.subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Amount</h4>
                <p className="text-sm text-muted-foreground">
                  ${subscriptionContext.subscription.pricePerMonth}/month
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline">
                Update Payment Method
              </Button>
              <Button variant="outline">
                Download Invoice
              </Button>
              <Button variant="outline">
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Need Help?
          </CardTitle>
          <CardDescription>
            Our support team is here to help you with any billing questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <h4 className="font-medium">Email Support</h4>
              <p className="text-sm text-muted-foreground">
                Get help via email within 24 hours
              </p>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
            <div className="text-center space-y-2">
              <h4 className="font-medium">Live Chat</h4>
              <p className="text-sm text-muted-foreground">
                Chat with our support team
              </p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </div>
            <div className="text-center space-y-2">
              <h4 className="font-medium">Documentation</h4>
              <p className="text-sm text-muted-foreground">
                Browse our help center
              </p>
              <Button variant="outline" size="sm">
                View Docs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;