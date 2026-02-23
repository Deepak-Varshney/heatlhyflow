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
import { createPatient } from "@/app/actions/patient-actions";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

export default function PatientRegistrationDialog() {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    dateOfBirth: z.date({
      error: "Date of birth is required.",
    }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .optional()
      .or(z.literal("")),
    address: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    bp: z.string().optional(),
    weight: z.number().nullable().optional(),
    occupation: z.string().optional(),
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
          <IconPlus /> Add Patient
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
              {/* Mandatory Fields - First */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-6 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
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
                    <FormLabel className="flex shrink-0">
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
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
                    <FormLabel className="flex shrink-0">
                      Date of Birth <span className="text-red-500">*</span>
                    </FormLabel>
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
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

              {/* Optional Fields */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">
                      Email <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          className="w-full"
                          {...field}
                          value={field.value || ""}
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
                    <FormLabel className="flex shrink-0">
                      Address <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Textarea
                          placeholder="Full residential address"
                          className="w-full"
                          {...field}
                          value={field.value || ""}
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
                    <FormLabel className="flex shrink-0">
                      Blood Pressure <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="e.g. 120/80"
                          type="text"
                          className="w-full"
                          {...field}
                          value={field.value || ""}
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
                    <FormLabel className="flex shrink-0">
                      Weight <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="e.g. 70 (In kg)"
                          type="number"
                          className="w-full"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : Number(value));
                          }}
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
                    <FormLabel className="flex shrink-0">
                      Occupation <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="e.g. Teacher"
                          type="text"
                          className="w-full"
                          {...field}
                          value={field.value || ""}
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
                    <FormLabel className="flex shrink-0">
                      Emergency Contact Phone <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 000-0000"
                          type="tel"
                          className="w-full"
                          {...field}
                          value={field.value || ""}
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