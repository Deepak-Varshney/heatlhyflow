import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, CreditCard, DollarSign } from "lucide-react";
import Link from "next/link";

// For Clerk billing, we don't create subscriptions in our database
// Instead, we redirect to Clerk's billing portal or provide information
const CreateSubscriptionForm = ({ organizations }: { organizations: any[] }) => {
  return (
    <div className="space-y-6">
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
      </div>

      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Clerk Billing Integration</h3>
        <p className="text-blue-800 text-sm mb-4">
          Since you&apos;re using Clerk billing, subscription management is handled through Clerk&apos;s dashboard. 
          Organizations will automatically get access based on their Clerk subscription status.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer">
              <CreditCard className="h-4 w-4 mr-2" />
              Go to Clerk Dashboard
            </a>
          </Button>
          <Link href="/superadmin/subscriptions">
            <Button variant="outline">
              Back to Subscriptions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CreateSubscriptionPage = async () => {
  await connectDB();
  
  // Get active organizations
  const activeOrganizations = await Organization.find({ 
    status: "ACTIVE" 
  }).select('_id name status');

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
          <h1 className="text-3xl font-bold">Clerk Billing Management</h1>
          <p className="text-muted-foreground">
            Manage organization subscriptions through Clerk billing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Clerk Billing Integration</CardTitle>
              <CardDescription>
                Manage subscriptions through Clerk&apos;s billing system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeOrganizations.length > 0 ? (
                <CreateSubscriptionForm organizations={JSON.parse(JSON.stringify(activeOrganizations))} />
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active organizations found</p>
                  <Link href="/superadmin/subscriptions">
                    <Button variant="outline" className="mt-4">
                      View Subscriptions
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clerk Billing Features</CardTitle>
              <CardDescription>What you can manage through Clerk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Subscription Plans</h4>
                    <p className="text-sm text-muted-foreground">Manage Basic ($10/month) and custom plans</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Payment Processing</h4>
                    <p className="text-sm text-muted-foreground">Automatic billing and payment collection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Organization Access</h4>
                    <p className="text-sm text-muted-foreground">Automatic feature access based on subscription</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Clerk Dashboard
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="https://dashboard.clerk.com/organizations" target="_blank" rel="noopener noreferrer">
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Organizations
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="https://dashboard.clerk.com/billing" target="_blank" rel="noopener noreferrer">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Billing Settings
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionPage;