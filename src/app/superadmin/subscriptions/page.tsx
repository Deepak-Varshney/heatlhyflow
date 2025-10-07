import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  AlertCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/types/subscription";

const ClerkSubscriptionsPage = async () => {
  await connectDB();
  
  // Get all organizations with their subscription info
  const organizations = await Organization.find({ status: "ACTIVE" })
    .populate('owner')
    .lean();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "cancelled":
        return "destructive";
      case "past_due":
        return "destructive";
      case "trialing":
        return "secondary";
      case "incomplete":
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
            Monitor organization subscriptions managed through Clerk
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Clerk Dashboard
          </Button>
        </div>
      </div>

      {/* Subscription Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                <p className="text-2xl font-bold">{organizations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold">
                  {organizations.filter(org => org.subscription).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  ${organizations.reduce((total, org) => {
                    // This would need to be calculated based on actual subscription data
                    return total + (org.subscription ? 10 : 0); // Assuming $10 for basic plan
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {organizations.reduce((total, org) => {
                    // This would need to be calculated based on actual user counts
                    return total + 1; // Placeholder
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organizations List */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Subscriptions</CardTitle>
          <CardDescription>
            View and manage organization subscriptions through Clerk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organizations.length > 0 ? (
              organizations.map((org: any) => (
                <div key={org._id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 border rounded-lg gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Owner: {org.owner?.firstName} {org.owner?.lastName}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {new Date(org.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Badge variant={org.status === "ACTIVE" ? "default" : "secondary"}>
                          {org.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <p>Clerk Org ID: {org.clerkOrgId}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View in Clerk
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No organizations found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clerk Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Clerk Subscription Integration
          </CardTitle>
          <CardDescription>
            Information about your Clerk subscription setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Current Setup</h4>
              <p className="text-sm text-muted-foreground">
                Subscriptions are managed through Clerk's subscription system
              </p>
            </div>
            <div>
              <h4 className="font-medium">Available Plans</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">Free</Badge>
                <Badge variant="secondary">Basic ($10/month)</Badge>
                <Badge variant="default">Professional</Badge>
                <Badge variant="default">Enterprise</Badge>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              To manage subscriptions, billing, and customer data, use the Clerk Dashboard. 
              This page provides an overview of your organization's subscription status.
            </p>
            
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Clerk Dashboard
              </Button>
              <Button variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkSubscriptionsPage;