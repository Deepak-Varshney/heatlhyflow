import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { createSubscriptionAction } from "@/actions/create-subscription-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, CreditCard, DollarSign } from "lucide-react";
import Link from "next/link";
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/types/subscription";

const CreateSubscriptionForm = ({ organizations }: { organizations: any[] }) => {

  return (
    <form action={createSubscriptionAction} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="organizationId">Select Organization *</Label>
          <Select name="organizationId" required>
            <SelectTrigger>
              <SelectValue placeholder="Choose an organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org._id} value={org._id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {org.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="planType">Subscription Plan *</Label>
          <Select name="planType" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{plan.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${plan.price.monthly}/month
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingCycle">Billing Cycle</Label>
          <Select name="billingCycle" defaultValue="MONTHLY">
            <SelectTrigger>
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly (Save 2 months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          <CreditCard className="h-4 w-4 mr-2" />
          Create Subscription
        </Button>
        <Link href="/superadmin/subscriptions">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
};

const CreateSubscriptionPage = async () => {
  await connectDB();
  
  // Get organizations that don't have subscriptions yet
  const organizationsWithoutSubscriptions = await Organization.aggregate([
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'organization',
        as: 'subscriptionInfo'
      }
    },
    {
      $match: {
        subscriptionInfo: { $eq: [] },
        status: "ACTIVE" // Only show active organizations
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        status: 1
      }
    }
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 overflow-scroll h-[90vh]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/superadmin/subscriptions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subscriptions
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Subscription</h1>
          <p className="text-muted-foreground">
            Assign a subscription plan to an organization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                Select an organization and choose their subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {organizationsWithoutSubscriptions.length > 0 ? (
                <CreateSubscriptionForm organizations={JSON.parse(JSON.stringify(organizationsWithoutSubscriptions))} />
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">All active organizations already have subscriptions</p>
                  <Link href="/superadmin/subscriptions">
                    <Button variant="outline" className="mt-4">
                      View Existing Subscriptions
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Plan Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>Subscription plan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                <div key={key} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{plan.name}</h4>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-bold">${plan.price.monthly}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="text-xs text-muted-foreground">
                    <div>Users: {plan.features.maxUsers === -1 ? "Unlimited" : plan.features.maxUsers}</div>
                    <div>Appointments: {plan.features.maxAppointments === -1 ? "Unlimited" : plan.features.maxAppointments}</div>
                    <div>Patients: {plan.features.maxPatients === -1 ? "Unlimited" : plan.features.maxPatients}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                  <div key={key} className="border rounded p-2">
                    <div className="font-medium text-xs">{plan.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {plan.features.advancedAnalytics && "Analytics "}
                      {plan.features.customBranding && "Branding "}
                      {plan.features.apiAccess && "API "}
                      {plan.features.prioritySupport && "Priority Support "}
                      {plan.features.customIntegrations && "Integrations"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionPage;