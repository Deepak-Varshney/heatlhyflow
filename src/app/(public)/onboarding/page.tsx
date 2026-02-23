import { OnboardingForm } from "@/components/onboarding-form";
import PageContainer from "@/components/layout/page-container";
import { CheckCircle, Users, Clock, Shield, Zap, BarChart3, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Join HealthyFlow - Healthcare Management Platform",
  description: "Request access to HealthyFlow and manage your clinic or hospital efficiently.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      <PageContainer scrollable={true}>
        <div className="w-full max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50/50">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Trusted by 500+ Healthcare Professionals</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">Ready to Transform Your</span><br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Healthcare Practice?
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join the HealthyFlow platform and streamline your clinic operations. Request access today and start managing patients, appointments, and treatments with ease.
            </p>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Left Column - Features */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose HealthyFlow?</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Patient Management</h3>
                    <p className="text-sm text-gray-600">
                      Comprehensive patient records and medical history at your fingertips
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
                    <p className="text-sm text-gray-600">
                      Intelligent appointment scheduling that reduces no-shows and saves time
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Treatment Tracking</h3>
                    <p className="text-sm text-gray-600">
                      Monitor treatments and prescriptions with complete audit trails
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
                    <p className="text-sm text-gray-600">
                      HIPAA-compliant with enterprise-grade security and data protection
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
                    <p className="text-sm text-gray-600">
                      Detailed insights into your practice performance and patient care metrics
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                    <p className="text-sm text-gray-600">
                      Easy team management and communication tools for your entire staff
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <OnboardingForm />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 lg:p-12 text-white mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <p className="text-blue-100">Healthcare Professionals</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <p className="text-blue-100">Patients Managed</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100K+</div>
                <p className="text-blue-100">Appointments Scheduled</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <p className="text-blue-100">Uptime Guarantee</p>
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Our Simple Onboarding Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 relative z-10">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fill Out Form</h3>
                  <p className="text-sm text-gray-600">
                    Complete your organization details and requirements
                  </p>
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gradient-to-r from-blue-200 to-transparent -z-10 translate-x-8" />
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 relative z-10">
                    <span className="text-2xl font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">We Review</h3>
                  <p className="text-sm text-gray-600">
                    Our team verifies your information (24-48 hours)
                  </p>
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gradient-to-r from-blue-200 to-transparent -z-10 translate-x-8" />
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 relative z-10">
                    <span className="text-2xl font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Get Approved</h3>
                  <p className="text-sm text-gray-600">
                    Receive confirmation email with setup instructions
                  </p>
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gradient-to-r from-blue-200 to-transparent -z-10 translate-x-8" />
              </div>

              <div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Start Using</h3>
                  <p className="text-sm text-gray-600">
                    Access your dashboard and begin managing patients
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 py-12 text-center">
            <p className="text-gray-600 mb-6">
              Need help? Contact our support team at <span className="font-semibold text-blue-600">support@healthyflow.com</span>
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
