// app/onboarding/page.tsx
'use client'

import { OrganizationList, useUser } from "@clerk/nextjs";
import OnboardingRoleSelection from "@/components/onboarding-role-selection";

const OnboardingPage = () => {
  // We only need the useUser hook for this check.
  const { user, isLoaded } = useUser();

  // Show a loading state until the user object has been fetched from Clerk.
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Check the complete list of memberships from the user object.
  // The '?? []' provides a safe empty array if the property doesn't exist.
  const organizationMemberships = user?.organizationMemberships ?? [];
  const isMemberOfOrg = organizationMemberships.length > 0;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to the Clinic Platform</h1>
          <p className="text-muted-foreground">{`Let&apos;s get your account set up.`}</p>
        </div>

        {isMemberOfOrg ? (
          // If they are a member of ANY organization, show role selection.
          <OnboardingRoleSelection />
        ) : (
          // Otherwise, show the component to let them join or create one.
          <div className="w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Join or Create a Clinic
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              To get started, you need to be part of a clinic. You can create a new one or join an existing clinic if you have an invitation.
            </p>
            <OrganizationList
              hidePersonal
              // Redirecting back to this page allows the component to re-render with new data.
              afterSelectOrganizationUrl="/onboarding"
              afterCreateOrganizationUrl="/onboarding"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;