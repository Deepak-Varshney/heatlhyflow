// components/OnboardingRoleSelection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, User, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SPECIALTIES } from "@/lib/specialities"; // Assuming you have this file
import { toast } from "sonner";
import { updateUserOnboarding } from "@/actions/onboarding-actions";

// Zod schema for the doctor details form
const doctorFormSchema = z.object({
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.coerce.number({ invalid_type_error: "Experience must be a number" }).int().min(0),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

export default function OnboardingRoleSelection() {
  const [selectedRole, setSelectedRole] = useState<"DOCTOR" | "RECEPTIONIST" | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: { specialty: "", experience: 0, description: "" },
  });
  const specialtyValue = watch("specialty");

  const handleRoleSelect = async (role: "DOCTOR" | "RECEPTIONIST") => {
    if (role === "RECEPTIONIST") {
      setLoading(true);
      const result = await updateUserOnboarding({ role: "RECEPTIONIST" });
      if (result.success) {
        toast.success("Profile updated successfully!");
        router.push(result.redirectUrl || "/dashboard");
      } else {
        toast.error(result.error || "Something went wrong.");
        setLoading(false);
      }
    } else {
      setSelectedRole("DOCTOR");
    }
  };

  const onDoctorSubmit = async (data: z.infer<typeof doctorFormSchema>) => {
    setLoading(true);
    const result = await updateUserOnboarding({ role: "DOCTOR", doctorDetails: data });
    if (result.success) {
      toast.success("Doctor profile submitted for verification!");
      router.push(result.redirectUrl || "/dashboard");
    } else {
      toast.error(result.error || "Something went wrong.");
      setLoading(false);
    }
  };

  if (selectedRole === "DOCTOR") {
    // Render Doctor Details Form
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <CardTitle>Complete Your Doctor Profile</CardTitle>
          <CardDescription>Provide your professional details for verification.</CardDescription>
          <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6 mt-6">
            {/* ... (Your Doctor Form Fields from the original code go here) ... */}
            {/* I've included them below for completeness */}
            <div className="space-y-2">
              <Label htmlFor="specialty">Medical Specialty</Label>
              <Select value={specialtyValue} onValueChange={(value) => setValue("specialty", value, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select your specialty" /></SelectTrigger>
                <SelectContent>{SPECIALTIES.map((spec) => (<SelectItem key={spec.name} value={spec.name}>{spec.name}</SelectItem>))}</SelectContent>
              </Select>
              {errors.specialty && <p className="text-sm text-red-500">{errors.specialty.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" type="number" placeholder="e.g., 5" {...register("experience")} />
              {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Profile Description</Label>
              <Textarea id="description" placeholder="Describe your expertise..." {...register("description")} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={() => setSelectedRole(null)} disabled={loading}>Back</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Submit for Verification"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Render Role Selection Cards
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Select Your Role</h2>
      <p className="text-muted-foreground mb-8">Choose how you will be participating in the clinic.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card className="cursor-pointer hover:border-primary" onClick={() => handleRoleSelect("RECEPTIONIST")}>
          <CardContent className="pt-6 text-center">
            <User className="h-10 w-10 mx-auto mb-4 text-primary" />
            <CardTitle>Join as a Receptionist</CardTitle>
            <CardDescription className="mt-2">Manage appointments and patient registrations.</CardDescription>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary" onClick={() => handleRoleSelect("DOCTOR")}>
          <CardContent className="pt-6 text-center">
            <Stethoscope className="h-10 w-10 mx-auto mb-4 text-primary" />
            <CardTitle>Join as a Doctor</CardTitle>
            <CardDescription className="mt-2">Provide consultations and manage patient care.</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}