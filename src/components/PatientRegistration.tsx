"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { createPatient } from "@/actions/patient-actions";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

export default function PatientRegistrationDialog() {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    dateOfBirth: z.date({
      required_error: "Date of birth is required.",
    }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    emergencyContactName: z.string().min(1, { message: "Emergency contact name is required" }),
    emergencyContactPhone: z.string().min(1, { message: "Emergency contact phone is required" }),
    bp: z.string().min(1, { message: "Blood pressure is required" }), // Add validation for blood pressure
    weight: z.string().min(1, { message: "Weight is required" }), // Add validation for weight
    occupation: z.string().min(1, { message: "Occupation is required" }), // Add validation for occupation
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      email: "",
      phoneNumber: "",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Call server action
      const result = await createPatient(values);

      if (result.success) {
        // Reset form and close dialog on success
        form.reset();
        setOpen(false);
        toast.success("Patient Added Success")
      } else {
        // Handle error (show error message)
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to submit form:");
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus /> Add New
        </Button>

      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Registration</DialogTitle>
          <DialogDescription>
            Complete your patient registration form for our healthcare facility.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={onReset}
            className="space-y-6"
          >
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-6 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">First Name</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="John"
                          type="text"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="col-span-6 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Last Name</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          type="text"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Date of Birth Field */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Date of Birth</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="date"
                          className="w-full"
                          value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                          onChange={(e) => {
                            const date = e.target.valueAsDate;
                            if (date) {
                              field.onChange(date);
                            }
                          }}
                          max={format(new Date(), "yyyy-MM-dd")}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bp"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Blood Pressure</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="e.g. 120/80"
                          type="text"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Weight</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="e.g. 70 kg"
                          type="text"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Occupation</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="e.g. Teacher"
                          type="text"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Email</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Phone Number</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 000-0000"
                          type="tel"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Address</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Textarea
                          placeholder="Full residential address"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Emergency Contact Name</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Emergency Contact Full Name"
                          type="text"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Emergency Contact Phone</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 000-0000"
                          type="tel"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="col-span-12 flex gap-4 justify-end mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Complete Registration
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}