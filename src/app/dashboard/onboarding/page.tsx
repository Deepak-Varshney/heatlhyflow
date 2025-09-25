// // "use client";

// // import { useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { User, Stethoscope, Loader2 } from "lucide-react";
// // import { Label } from "@/components/ui/label";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { SPECIALTIES } from "@/lib/specialities";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // // import { setUserRole } from "@/actions/onboarding";
// // import { useEffect } from "react";
// // import z from "zod";

// // const doctorFormSchema = z.object({
// //   specialty: z.string().min(1, "Specialty is required"),
// //   experience: z
// //     .number({ invalid_type_error: "Experience must be a number" })
// //     .int()
// //     .min(1, "Experience must be at least 1 year")
// //     .max(70, "Experience must be less than 70 years"),
// //   credentialUrl: z
// //     .string()
// //     .url("Please enter a valid URL")
// //     .min(1, "Credential URL is required"),
// //   description: z
// //     .string()
// //     .min(20, "Description must be at least 20 characters")
// //     .max(1000, "Description cannot exceed 1000 characters"),
// // });
// // export default function OnboardingPage() {
// //   const [step, setStep] = useState("choose-role");
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);

// //   // React Hook Form setup with Zod validation
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //     setValue,
// //     watch,
// //   } = useForm({
// //     resolver: zodResolver(doctorFormSchema),
// //     defaultValues: {
// //       specialty: "",
// //       experience: undefined,
// //       credentialUrl: "",
// //       description: "",
// //     },
// //   });

// //   // Watch specialty value for controlled select component
// //   const specialtyValue = watch("specialty");

// //   // Handle patient role selection
// //   const handlePatientSelection = async () => {
// //     if (loading) return;

// //     const formData = new FormData();
// //     formData.append("role", "PATIENT");

// //     // await submitUserRole(formData);
// //   };

// //   // useEffect(() => {
// //   //   if (data && data?.success) {
// //   //     router.push(data.redirect);
// //   //   }
// //   // }, [data]);

// //   // Added missing onDoctorSubmit function
// //   const onDoctorSubmit = async (data) => {
// //     if (loading) return;

// //     const formData = new FormData();
// //     formData.append("role", "DOCTOR");
// //     formData.append("specialty", data.specialty);
// //     formData.append("experience", data.experience.toString());
// //     formData.append("credentialUrl", data.credentialUrl);
// //     formData.append("description", data.description);

// //     // await submitUserRole(formData);
// //   };

// //   // Role selection screen
// //   if (step === "choose-role") {
// //     return (
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <Card
// //           className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
// //           onClick={() => !loading && handlePatientSelection()}
// //         >
// //           <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
// //             <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
// //               <User className="h-8 w-8 text-emerald-400" />
// //             </div>
// //             <CardTitle className="text-xl font-semibold text-white mb-2">
// //               Join as a Patient
// //             </CardTitle>
// //             <CardDescription className="mb-4">
// //               Book appointments, consult with doctors, and manage your
// //               healthcare journey
// //             </CardDescription>
// //             <Button
// //               className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                   Processing...
// //                 </>
// //               ) : (
// //                 "Continue as Patient"
// //               )}
// //             </Button>
// //           </CardContent>
// //         </Card>

// //         <Card
// //           className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
// //           onClick={() => !loading && setStep("doctor-form")}
// //         >
// //           <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
// //             <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
// //               <Stethoscope className="h-8 w-8 text-emerald-400" />
// //             </div>
// //             <CardTitle className="text-xl font-semibold text-white mb-2">
// //               Join as a Doctor
// //             </CardTitle>
// //             <CardDescription className="mb-4">
// //               Create your professional profile, set your availability, and
// //               provide consultations
// //             </CardDescription>
// //             <Button
// //               className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
// //               disabled={loading}
// //             >
// //               Continue as Doctor
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   // Doctor registration form
// //   if (step === "doctor-form") {
// //     return (
// //       <Card className="border-emerald-900/20">
// //         <CardContent className="pt-6">
// //           <div className="mb-6">
// //             <CardTitle className="text-2xl font-bold text-white mb-2">
// //               Complete Your Doctor Profile
// //             </CardTitle>
// //             <CardDescription>
// //               Please provide your professional details for verification
// //             </CardDescription>
// //           </div>

// //           <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
// //             <div className="space-y-2">
// //               <Label htmlFor="specialty">Medical Specialty</Label>
// //               <Select
// //                 value={specialtyValue}
// //                 onValueChange={(value) => setValue("specialty", value)}
// //               >
// //                 <SelectTrigger id="specialty">
// //                   <SelectValue placeholder="Select your specialty" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {SPECIALTIES.map((spec) => (
// //                     <SelectItem
// //                       key={spec.name}
// //                       value={spec.name}
// //                       className="flex items-center gap-2"
// //                     >
// //                       <span className="text-emerald-400">{spec.icon}</span>
// //                       {spec.name}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //               {errors.specialty && (
// //                 <p className="text-sm font-medium text-red-500 mt-1">
// //                   {errors.specialty.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="experience">Years of Experience</Label>
// //               <Input
// //                 id="experience"
// //                 type="number"
// //                 placeholder="e.g. 5"
// //                 {...register("experience", { valueAsNumber: true })}
// //               />
// //               {errors.experience && (
// //                 <p className="text-sm font-medium text-red-500 mt-1">
// //                   {errors.experience.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="credentialUrl">Link to Credential Document</Label>
// //               <Input
// //                 id="credentialUrl"
// //                 type="url"
// //                 placeholder="https://example.com/my-medical-degree.pdf"
// //                 {...register("credentialUrl")}
// //               />
// //               {errors.credentialUrl && (
// //                 <p className="text-sm font-medium text-red-500 mt-1">
// //                   {errors.credentialUrl.message}
// //                 </p>
// //               )}
// //               <p className="text-sm text-muted-foreground">
// //                 Please provide a link to your medical degree or certification
// //               </p>
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="description">Description of Your Services</Label>
// //               <Textarea
// //                 id="description"
// //                 placeholder="Describe your expertise, services, and approach to patient care..."
// //                 rows={4}
// //                 {...register("description")}
// //               />
// //               {errors.description && (
// //                 <p className="text-sm font-medium text-red-500 mt-1">
// //                   {errors.description.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="pt-2 flex items-center justify-between">
// //               <Button
// //                 type="button"
// //                 variant="outline"
// //                 onClick={() => setStep("choose-role")}
// //                 className="border-emerald-900/30"
// //                 disabled={loading}
// //               >
// //                 Back
// //               </Button>
// //               <Button
// //                 type="submit"
// //                 className="bg-emerald-600 hover:bg-emerald-700"
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <>
// //                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                     Submitting...
// //                   </>
// //                 ) : (
// //                   "Submit for Verification"
// //                 )}
// //               </Button>
// //             </div>
// //           </form>
// //         </CardContent>
// //       </Card>
// //     );
// //   }
// // }


// // app/onboarding/page.tsx

// import { currentUser } from "@clerk/nextjs/server";
// import { OrganizationList } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import OnboardingRoleSelection from "@/components/onboarding-role-selection";

// const OnboardingPage = async () => {
//   const user = await currentUser();

//   if (!user) {
//     redirect("/sign-in");
//   }

//   // Check if the user is already part of an organization
//   const organizationMemberships = user.organizationMemberships;
//   const isMemberOfOrg = organizationMemberships && organizationMemberships.length > 0;

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="w-full max-w-4xl p-8">
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-bold mb-2">Welcome to the Clinic Platform</h1>
//           <p className="text-muted-foreground">Let's get your account set up.</p>
//         </div>

//         {isMemberOfOrg ? (
//           // If they are in an org, show the role selection component
//           <OnboardingRoleSelection />
//         ) : (
//           // If not, show Clerk's component to let them join or create a clinic
//           <div className="w-full max-w-lg mx-auto">
//             <h2 className="text-2xl font-semibold text-center mb-4">
//               Join or Create a Clinic
//             </h2>
//             <p className="text-center text-muted-foreground mb-6">
//               To get started, you need to be part of a clinic. You can create a new one or join an existing clinic if you have an invitation.
//             </p>
//             <OrganizationList
//               hidePersonal // Hides the "personal account" option
//               afterSelectOrganizationUrl="/dashboard" // Redirects back here after joining
//               afterCreateOrganizationUrl="/dashboard" // Redirects back here after creating
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OnboardingPage;

export default function page(){
  return (
    <div>Onboarding</div>
    )
}
