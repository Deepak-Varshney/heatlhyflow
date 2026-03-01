
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updatePatient } from "@/app/actions/patient-actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Form ke liye validation schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  bp: z.string().optional(),
  weight: z.number().optional(),
  occupation: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type EditPatientFormValues = z.infer<typeof formSchema>;

export function EditPatientDialog({ patient, open, onOpenChange }: { patient: any; open: boolean; onOpenChange: (open: boolean) => void; }) {
  const router = useRouter();
  const form = useForm<EditPatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: patient,
  });

  // Jab bhi patient data badle, form ko reset karein
  useEffect(() => {
    form.reset(patient);
  }, [patient, form]);

  async function onSubmit(values: EditPatientFormValues) {
    const result = await updatePatient(patient._id, values);
    if (result.success) {
      toast.success("Patient details updated successfully!");
      onOpenChange(false); // Dialog band karein
      router.refresh(); // Page ko refresh karein taaki naya data dikhe
    } else {
      toast.error(result.error || "Failed to update details.");
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Edit Patient Details</DialogTitle>
          <DialogDescription>
            Make changes to the patient&apos;s profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="firstName" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="lastName" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField name="occupation" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="phoneNumber" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField name="address" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-3 gap-4">
               <FormField name="bp" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Blood Pressure</FormLabel><FormControl><Input placeholder="e.g., 120/80" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField name="weight" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField name="medicalHistory" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Patient History</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}