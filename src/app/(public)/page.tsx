import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Zap, Users } from "lucide-react";
import PageContainer from "@/components/layout/page-container";

export const metadata = {
  title: "HealthyFlow - Modern Healthcare Management Platform",
  description:
    "Streamline your clinic or hospital operations with our comprehensive healthcare management platform. Patient management, Appointment scheduling, Treatment tracking.",
};

export default function LandingPage() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Patient Management",
      description: "Complete patient profiles with medical history, documents, and consultation notes",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Intelligent appointment scheduling that reduces no-shows and optimizes staff time",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security and compliance for healthcare data",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Treatment Tracking",
      description: "Monitor prescriptions and treatments with complete audit trails",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Chief of Medicine",
      clinic: "City Hospital",
      text: "HealthyFlow has transformed how we manage patient records. It's secure, intuitive, and our staff loves it.",
      avatar: "🏥",
    },
    {
      name: "Dr. Priya Sharma",
      role: "Clinic Owner",
      clinic: "Sharma Medical Clinic",
      text: "The appointment scheduling feature alone has reduced our no-show rate by 40%. Highly recommended!",
      avatar: "👩‍⚕️",
    },
    {
      name: "Dr. Arun Patel",
      role: "Medical Director",
      clinic: "Wellness Center",
      text: "Best investment we made for our clinic. The ROI has been exceptional. Keep up the great work!",
      avatar: "👨‍⚕️",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Request Access",
      description: "Fill out your clinic/hospital information and submit your application",
    },
    {
      number: "2",
      title: "Get Approved",
      description: "Our team reviews your application (24-48 hours) and approves it",
    },
    {
      number: "3",
      title: "Login & Setup",
      description: "Create your account via Google and customize your clinic settings",
    },
    {
      number: "4",
      title: "Start Managing",
      description: "Begin managing patients, appointments, and treatments immediately",
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          {/* Background gradient */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

          <div className="relative z-10">
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Healthcare Management,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Simplified
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Manage your clinic or hospital efficiently with our comprehensive platform. From patient
                records to appointment scheduling - everything you need in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/onboarding">
                  <Button size="lg" className="text-base px-8 py-6">
                    Request Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-base px-8 py-6">
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  24/7 Support
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  No Setup Fees
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 aspect-video flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🏥</div>
                  <p className="text-gray-600">Platform Interface Preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 mt-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Powerful Features for Modern Clinics</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your healthcare practice efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="text-blue-600 mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 mt-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Simple Onboarding Process</h2>
            <p className="text-xl text-gray-600">Get started in just 4 steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-blue-200 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/onboarding">
              <Button size="lg" className="text-base px-8 py-6">
                Start Your Application Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 mt-12 bg-gray-50/50 rounded-xl px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Trusted by Healthcare Professionals</h2>
            <p className="text-xl text-gray-600">See what our users say about HealthyFlow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex gap-4 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.clinic}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-white">Ready to Transform Your Practice?</h2>
            <p className="text-xl text-blue-100">
              Join healthcare professionals already using HealthyFlow to manage their clinics and hospitals
              more efficiently
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" variant="secondary" className="text-base px-8 py-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-white/10 text-white border-white hover:bg-white/20">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-12 mt-12 text-center">
          <Link href="/onboarding">
            <Button size="lg" className="text-base px-8 py-6">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>
      </div>
    </PageContainer>
  );
}
