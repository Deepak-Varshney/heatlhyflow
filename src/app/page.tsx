import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  Lock,
  Activity,
  BarChart3,
  Stethoscope,
  Heart,
  BriefcaseIcon,
  TrendingUp,
  Zap,
  Shield,
  FileText,
  Bell,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import PageContainer from "@/components/layout/page-container";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "HealthyFlow - Modern Healthcare Management Platform",
  description:
    "Streamline your clinic or hospital operations with our comprehensive healthcare management platform. Patient management, Appointment scheduling, Treatment tracking.",
};

export default async function LandingPage() {
  const User = await currentUser();
  if (User) {
    redirect("/dashboard");
  }

  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description: "Complete patient profiles with medical history, documents, and detailed consultation notes",
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/25",
    },
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Intelligent appointment system that reduces no-shows by 40% and optimizes staff time",
      color: "from-green-500 to-green-600",
      shadow: "shadow-green-500/25",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "HIPAA compliant with enterprise-grade encryption for all healthcare data",
      color: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/25",
    },
    {
      icon: Activity,
      title: "Treatment Tracking",
      description: "Monitor prescriptions and treatments with complete audit trails and compliance reports",
      color: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-500/25",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive insights into clinic operations with detailed reports and trends",
      color: "from-cyan-500 to-cyan-600",
      shadow: "shadow-cyan-500/25",
    },
    {
      icon: Bell,
      title: "Patient Notifications",
      description: "Automated appointment reminders and patient updates via SMS and email",
      color: "from-red-500 to-red-600",
      shadow: "shadow-red-500/25",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Streamlined Operations",
      description: "Reduce administrative overhead by 60% with automated workflows and centralized management",
    },
    {
      icon: Heart,
      title: "Better Patient Care",
      description: "Spend more time with patients by eliminating manual paperwork and repetitive tasks",
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Insights",
      description: "Make informed decisions with real-time analytics and comprehensive reporting tools",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with automatic backups and encryption for peace of mind",
    },
  ];

  const stats = [
    { label: "Healthcare Providers", value: "500+", icon: "🏥" },
    { label: "Patients Managed", value: "100K+", icon: "👥" },
    { label: "Appointments Scheduled", value: "1M+", icon: "📅" },
    { label: "Uptime Guarantee", value: "99.9%", icon: "⚡" },
  ];

  const steps = [
    {
      number: "01",
      title: "Submit Application",
      description: "Fill out basic clinic information and tell us about your practice",
      icon: FileText,
    },
    {
      number: "02",
      title: "Get Verified",
      description: "Our team reviews and approves your application within 24-48 hours",
      icon: CheckCircle,
    },
    {
      number: "03",
      title: "Setup & Train",
      description: "Customize settings and get personalized onboarding support from our team",
      icon: Stethoscope,
    },
    {
      number: "04",
      title: "Go Live",
      description: "Start managing patients, appointments, and treatments immediately",
      icon: Sparkles,
    },
  ];

  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Chief of Medicine, City Hospital",
      text: "HealthyFlow transformed our operations completely. Patient satisfaction scores increased by 35%, and our team's productivity has never been better.",
      avatar: "👨‍⚕️",
      rating: 5,
    },
    {
      name: "Dr. Priya Sharma",
      role: "Clinic Owner, Sharma Medical Clinic",
      text: "The scheduling feature alone reduced our no-shows from 20% to 12%. Combined with the patient management tools, it's been a game-changer.",
      avatar: "👩‍⚕️",
      rating: 5,
    },
    {
      name: "Dr. Arun Patel",
      role: "Medical Director, Wellness Center",
      text: "Best investment we've made. The ROI was evident within the first month. Our staff adopted it immediately because it's so intuitive.",
      avatar: "👨‍⚕️",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-slate-950">
      <PublicHeader />
      <PageContainer scrollable={true}>
        <div className="w-full">
          {/* Hero Section */}
          <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" style={{ backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, transparent), transparent, color-mix(in srgb, var(--primary) 5%, transparent))' }} />
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="max-w-5xl mx-auto">
                <div className="text-center space-y-8">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Trusted by 500+ healthcare providers</span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white">
                    Your Complete
                    <br />
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), #a855f7, var(--primary))' }}>
                      Healthcare Solution
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Manage patient records, schedule appointments, track treatments, and grow your practice with one integrated platform designed for modern healthcare.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Link href="/onboarding">
                      <Button size="lg" className="text-base px-8 h-12 gap-2 text-white" style={{ backgroundColor: 'var(--primary)', backgroundImage: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 120%, #000))' }}>
                        Start Free Trial
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="text-base px-8 h-12 border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                      Schedule Demo
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 pt-4 sm:pt-8 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>HIPAA Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>No Hidden Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 sm:py-16 md:py-20 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="group relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800" style={{ borderColor: 'var(--primary)' }}>
                    <CardHeader className="p-6 md:p-8 space-y-3">
                      <div className="text-4xl md:text-5xl">{stat.icon}</div>
                      <CardTitle className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, var(--primary), #a855f7)` }}>
                        {stat.value}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 md:mb-16 space-y-4 max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Powerful Features Built for You
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                  Everything you need to run a modern, efficient healthcare practice
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={idx}
                      className="group relative overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800"
                    >
                      <CardHeader className="space-y-4">
                        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-xl text-gray-900 dark:text-white">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
                {/* Left Column */}
                <div className="space-y-8 order-2 lg:order-1">
                  <div className="space-y-4">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Why Choose HealthyFlow
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                      Join hundreds of healthcare providers that trust us for their management needs
                    </p>
                  </div>

                  <div className="space-y-6 pt-4">
                    {benefits.map((benefit, idx) => {
                      const Icon = benefit.icon;
                      const colors = ["from-blue-500", "from-purple-500", "from-green-500", "from-orange-500"];
                      return (
                        <div key={idx} className="flex gap-4 group">
                          <div className="shrink-0">
                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors[idx]} to-${colors[idx].split("-")[1]}-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {benefit.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column - Stats Cards */}
                <div className="order-1 lg:order-2">
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800">
                      <CardHeader className="p-6 md:p-8 space-y-2">
                        <div className="text-3xl">🏥</div>
                        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          500+
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-gray-600 dark:text-gray-400">
                          Healthcare Providers
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800">
                      <CardHeader className="p-6 md:p-8 space-y-2">
                        <div className="text-3xl">👥</div>
                        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          100K+
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-gray-600 dark:text-gray-400">
                          Patients Managed
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800">
                      <CardHeader className="p-6 md:p-8 space-y-2">
                        <div className="text-3xl">📅</div>
                        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          1M+
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-gray-600 dark:text-gray-400">
                          Appointments
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800">
                      <CardHeader className="p-6 md:p-8 space-y-2">
                        <div className="text-3xl">⚡</div>
                        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          99.9%
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-gray-600 dark:text-gray-400">
                          Uptime
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 md:mb-16 space-y-4 max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Simple Onboarding Process
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                  From signup to managing patients in less than an hour
                </p>
              </div>

              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-6 md:gap-0 relative mb-16">
                  {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={idx} className="relative">
                        {idx < steps.length - 1 && (
                          <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-blue-400 to-transparent" />
                        )}
                        <div className="space-y-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg mx-auto">
                            {step.number}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white text-center mb-2">
                              {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Benefits Cards */}
                <div className="grid sm:grid-cols-3 gap-6">
                  <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700">
                    <CardHeader className="space-y-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          No Account Creation
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                          Provide your details once, no need to pre-create accounts
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700">
                    <CardHeader className="space-y-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          Professional Vetting
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                          Only verified organizations get access to the platform
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700">
                    <CardHeader className="space-y-4">
                      <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          Quick Setup
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                          Get up and running in minutes with our intuitive onboarding
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 md:mb-16 space-y-4 max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Loved by Healthcare Professionals
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                  Join hundreds of clinics and hospitals improving patient care
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonials.map((testimonial, idx) => (
                  <Card
                    key={idx}
                    className="group relative overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800"
                  >
                    <CardHeader className="space-y-4">
                      {/* Rating */}
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">⭐</span>
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                        "{testimonial.text}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-3xl">{testimonial.avatar}</div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden text-white" style={{ backgroundColor: 'var(--primary)' }}>
            <div className="absolute inset-0 bg-grid-white/10 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                  Transform Your Practice Today
                </h2>
                <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
                  Join hundreds of healthcare providers already using HealthyFlow. Request access today and start your professional onboarding journey.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/onboarding">
                    <Button size="lg" className="text-base px-8 h-12 gap-2 shadow-xl hover:scale-105 transition-transform text-white" style={{ backgroundColor: 'color-mix(in srgb, #fff 20%, var(--primary))' }}>
                      Start Free Trial
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-12 border-2 border-white text-white hover:bg-white transition-colors font-semibold"
                    style={{ color: 'white' }}
                  >
                    Schedule Demo
                  </Button>
                </div>

                {/* Additional trust elements */}
                <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Setup in minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Dedicated support</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                  Trusted and Secure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="text-5xl">🔒</div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      Enterprise Security
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      End-to-end encryption for all data
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-5xl">✓</div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      HIPAA Certified
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Full compliance guaranteed
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-5xl">🛡️</div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      Data Protection
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Automatic daily backups
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
