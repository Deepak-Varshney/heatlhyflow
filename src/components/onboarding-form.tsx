"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitOnboardingRequest } from "@/app/actions/onboarding-request-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "@/components/ui/time-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, User, Building2, Briefcase, ArrowRight, Loader2, ChevronRight, PartyPopper, Mail, Clock } from "lucide-react";

// Validation schema
const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address required"),
  organizationName: z.string().min(2, "Organization name required"),
  organizationType: z.enum(["CLINIC", "HOSPITAL", "PRIVATE_PRACTICE", "NURSING_HOME"]),
  treatments: z
    .string()
    .min(3, "Specify at least one treatment"),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  specialty: z.string().optional(),
  staffCount: z.coerce.number().min(1).optional(),
  operatingHoursStart: z.string().optional(),
  operatingHoursEnd: z.string().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema) as any,
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      organizationName: "",
      organizationType: "CLINIC",
      treatments: "",
      yearsOfExperience: undefined,
      specialty: "",
      staffCount: undefined,
      operatingHoursStart: "",
      operatingHoursEnd: "",
    },
  });

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Organization", icon: Building2 },
    { number: 3, title: "Professional", icon: Briefcase },
  ];

  const handleNextStep = async () => {
    // Validate current step fields before moving to next
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await form.trigger(["firstName", "lastName", "email", "phone", "address"]);
    } else if (currentStep === 2) {
      isValid = await form.trigger(["organizationName", "organizationType"]);
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Format operating hours from start and end times
      const operatingHours = data.operatingHoursStart && data.operatingHoursEnd
        ? `${data.operatingHoursStart} - ${data.operatingHoursEnd}`
        : "";

      // Parse treatments string into array
      const treatmentsArray = data.treatments
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const result = await submitOnboardingRequest({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        organizationName: data.organizationName,
        organizationType: data.organizationType,
        treatments: treatmentsArray,
        yearsOfExperience: data.yearsOfExperience,
        specialty: data.specialty,
        staffCount: data.staffCount,
        operatingHours: operatingHours,
      });

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Request submitted successfully!",
        });
        setIsSuccess(true);
        form.reset();
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to submit request",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="border-0 shadow-xl bg-white/98 backdrop-blur">
        {/* Success State */}
        {isSuccess ? (
          <>
            <CardHeader className="space-y-3 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <PartyPopper className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Application Submitted!
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    We've received your onboarding request
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                {/* Success Animation */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-pulse">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 animate-ping opacity-20" />
                  </div>
                </div>

                {/* Success Message */}
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Thank You for Your Application!
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your onboarding request has been successfully submitted. Our team will review your application and get back to you shortly.
                  </p>
                </div>

                {/* What's Next */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    What Happens Next?
                  </h3>
                  <div className="space-y-3 text-sm text-blue-800">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                      <p><span className="font-semibold">Review Process:</span> Our team will review your application within 24-48 hours.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                      <p><span className="font-semibold">Email Confirmation:</span> You'll receive an email with the status of your application.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                      <p><span className="font-semibold">Account Setup:</span> Once approved, you'll get access to set up your account.</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <Mail className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Questions about your application?
                  </p>
                  <a href="mailto:support@healthyflow.com" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    support@healthyflow.com
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all"
                  >
                    Back to Home
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      setIsSuccess(false);
                      setCurrentStep(1);
                      setSubmitStatus({ type: null, message: "" });
                    }}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Submit Another
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            {/* Step Indicator */}
            <div className="border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.number} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            currentStep >= step.number
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-2 border-blue-500"
                              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <p className={`text-xs font-semibold mt-2 ${
                          currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                        }`}>
                          {step.title}
                        </p>
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`w-8 h-1 mx-2 transition-all ${
                            currentStep > step.number ? "bg-blue-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

        <CardHeader className="space-y-3 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Join HealthyFlow
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Step {currentStep} of 3 - {steps[currentStep - 1].title}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          {submitStatus.type && (
            <Alert
              className={`mb-6 animate-in fade-in ${
                submitStatus.type === "success" 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription
                className={submitStatus.type === "success" ? "text-green-800" : "text-red-800"}
              >
                {submitStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900">First Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John" 
                              {...field} 
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900">Last Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Doe" 
                              {...field}
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Email Address *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="john@example.com" 
                            {...field}
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          We'll send confirmation and approval updates to this email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Phone Number *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+91 98765 43210" 
                            {...field}
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Address *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your clinic/hospital address" 
                            {...field} 
                            rows={2}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Organization Information */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Organization Information</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Clinic/Hospital Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="City Hospital" 
                            {...field}
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Organization Type *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CLINIC">Clinic</SelectItem>
                            <SelectItem value="HOSPITAL">Hospital</SelectItem>
                            <SelectItem value="PRIVATE_PRACTICE">Private Practice</SelectItem>
                            <SelectItem value="NURSING_HOME">Nursing Home</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="staffCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Number of Staff Members</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="10" 
                            {...field}
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="operatingHoursStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900">Operating Hours - Start</FormLabel>
                          <FormControl>
                            <TimeInput 
                              {...field}
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingHoursEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900">Operating Hours - End</FormLabel>
                          <FormControl>
                            <TimeInput 
                              {...field}
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Professional Information */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Primary Specialty</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Cardiology, General Surgery" 
                            {...field}
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Years of Experience</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5" 
                            {...field}
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="treatments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-900">Services/Treatments Offered *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter treatments separated by commas (e.g., Consultation, Surgery, Lab Tests)"
                            {...field}
                            rows={3}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all resize-none"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          List the main services or treatments your organization provides
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all"
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleNextStep}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {currentStep === 3 && (
                <div className="text-xs text-gray-500 text-center">
                  By submitting, you agree to our Terms of Service and Privacy Policy
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        </>
        )}
      </Card>
    </div>
  );
}
