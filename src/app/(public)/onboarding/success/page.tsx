import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/layout/page-container";

export const metadata = {
  title: "Application Submitted - HealthyFlow",
  description: "Your onboarding request has been received.",
};

export default function OnboardingSuccessPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="w-full flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full blur-xl" />
              <div className="relative bg-green-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Application Submitted!</h1>
            <p className="text-gray-600">
              Your onboarding request has been received successfully.
            </p>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4 text-left">
            <div>
              <p className="text-sm text-gray-500 font-medium">What happens next?</p>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 mt-2">
                <li>We review your application (24-48 hours)</li>
                <li>Our team verifies your information</li>
                <li>You'll receive an email with approval or next steps</li>
                <li>Access your account and get started</li>
              </ol>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 font-medium">Check your email</p>
              <p className="text-sm text-gray-700 mt-1">
                We've sent a confirmation email with your application details
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/">
              <Button className="w-full" variant="default" size="lg">
                Back to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full" variant="outline" size="lg">
                Learn More About HealthyFlow
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="text-xs text-gray-500">
            <p>Need help? Contact us at</p>
            <p className="font-medium text-blue-600">support@healthyflow.com</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
