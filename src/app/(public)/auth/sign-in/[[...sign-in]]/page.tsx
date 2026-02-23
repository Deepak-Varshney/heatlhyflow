import { CustomSignIn } from "@/components/custom-sign-in";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";

export const metadata = {
  title: "Sign In - HealthyFlow",
  description: "Sign in to your HealthyFlow account to manage your healthcare practice.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Value proposition */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Manage Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Healthcare Practice
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                HealthyFlow is the all-in-one platform for healthcare professionals to manage patients, appointments, and medical records with ease.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure & Compliant</h3>
                  <p className="text-sm text-gray-600">HIPAA-compliant platform with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Save Time</h3>
                  <p className="text-sm text-gray-600">Automate scheduling, patient management, and billing</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Collaborate Easily</h3>
                  <p className="text-sm text-gray-600">Work seamlessly with your team and colleagues</p>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Trusted by healthcare professionals</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  <strong>500+</strong> healthcare professionals
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Sign In Form */}
          <div className="order-1 lg:order-2">
            <CustomSignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
