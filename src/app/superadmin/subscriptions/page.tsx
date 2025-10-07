import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getAllSubscriptions, 
  updateSubscriptionPlan, 
  updateSubscriptionStatus,
  createSubscriptionForOrganization,
  deleteSubscription 
} from "@/actions/superadmin-actions";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Users, 
  Building2, 
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { SUBSCRIPTION_PLANS, SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// ActionForm for Subscription plan updates
const PlanUpdateForm = ({ 
  subscriptionId, 
  planType, 
  children, 
  variant 
}: {
  subscriptionId: string,
  planType: SubscriptionPlan,
  children: React.ReactNode,
  variant: "default" | "destructive" | "outline",
}) => {
  return (
    <form action={async () => {
      "use server";
      await updateSubscriptionPlan(subscriptionId, planType);
    }}>
      <Button type="submit" variant={variant} size="sm">{children}</Button>
    </form>
  );
};

// ActionForm for Subscription status updates
const StatusUpdateForm = ({ 
  subscriptionId, 
  status, 
  children, 
  variant 
}: {
  subscriptionId: string,
  status: SubscriptionStatus,
  children: React.ReactNode,
  variant: "default" | "destructive" | "outline",
}) => {
  return (
    <form action={async () => {
      "use server";
      await updateSubscriptionStatus(subscriptionId, status);
    }}>
      <Button type="submit" variant={variant} size="sm">{children}</Button>
    </form>
  );
};

// Delete subscription form
const DeleteSubscriptionForm = ({ 
  subscriptionId, 
  organizationName 
}: {
  subscriptionId: string,
  organizationName: string,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the subscription for {organizationName}? 
            This action cannot be undone and will immediately revoke access to all features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <form action={async () => {
              "use server";
              await deleteSubscription(subscriptionId);
            }}>
              <Button type="submit" variant="destructive">Delete</Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const SubscriptionsPage = async () => {
  await connectDB();
  
  // Get all subscriptions with pagination
  const subscriptionsData = await getAllSubscriptions({ page: 1, limit: 50 });
  const subscriptions = subscriptionsData.data;

  const getStatusBadgeVariant = (status: SubscriptionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "CANCELLED":
        return "destructive";
      case "PAST_DUE":
        return "destructive";
      case "TRIALING":
        return "secondary";
      case "INCOMPLETE":
        return "outline";
      default:
        return "outline";
    }
  };

  const getPlanBadgeVariant = (planType: SubscriptionPlan) => {
    switch (planType) {
      case "FREE":
        return "outline";
      case "BASIC":
        return "secondary";
      case "PROFESSIONAL":
        return "default";
      case "ENTERPRISE":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 overflow-scroll h-[90vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage organization subscriptions and billing
          </p>
        </div>
        <Link href="/superadmin/subscriptions/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Subscription
          </Button>
        </Link>
      </div>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
          <CardDescription>
            Manage subscription plans and statuses for all organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription: any) => (
                <div key={subscription._id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 border rounded-lg gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">{subscription.organization?.name || 'Unknown Organization'}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>Plan: </span>
                        <Badge variant={getPlanBadgeVariant(subscription.planType)}>
                          {subscription.planType}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Status: </span>
                        <Badge variant={getStatusBadgeVariant(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${subscription.pricePerMonth}/month</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{subscription.usage?.currentUsers || 0}/{subscription.features?.maxUsers === -1 ? '∞' : subscription.features?.maxUsers || 0} users</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <p>Period: {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                      <p>Billing: {subscription.billingCycle}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Plan Update Actions */}
                    <div className="flex gap-1">
                      <PlanUpdateForm subscriptionId={subscription._id} planType="FREE" variant="outline">
                        Free
                      </PlanUpdateForm>
                      <PlanUpdateForm subscriptionId={subscription._id} planType="BASIC" variant="outline">
                        Basic
                      </PlanUpdateForm>
                      <PlanUpdateForm subscriptionId={subscription._id} planType="PROFESSIONAL" variant="outline">
                        Pro
                      </PlanUpdateForm>
                      <PlanUpdateForm subscriptionId={subscription._id} planType="ENTERPRISE" variant="outline">
                        Enterprise
                      </PlanUpdateForm>
                    </div>
                    
                    {/* Status Update Actions */}
                    <div className="flex gap-1">
                      <StatusUpdateForm subscriptionId={subscription._id} status="ACTIVE" variant="default">
                        <CheckCircle className="h-4 w-4" />
                      </StatusUpdateForm>
                      <StatusUpdateForm subscriptionId={subscription._id} status="CANCELLED" variant="destructive">
                        <XCircle className="h-4 w-4" />
                      </StatusUpdateForm>
                      <StatusUpdateForm subscriptionId={subscription._id} status="PAST_DUE" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                      </StatusUpdateForm>
                    </div>
                    
                    {/* Delete Action */}
                    <DeleteSubscriptionForm 
                      subscriptionId={subscription._id} 
                      organizationName={subscription.organization?.name || 'Unknown Organization'} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No subscriptions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsPage;