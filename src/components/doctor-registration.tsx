"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { createDoctor } from "@/actions/doctor-actions";

// Define the schema for a single availability rule
const availabilitySchema = z.object({
  dayOfWeek: z.string(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

// Define the main form schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  specialization: z.string().min(1, "Specialization is required"),
  // Availability is an array of the schema defined above
  availability: z.array(availabilitySchema).optional(),
});

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorRegistrationDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      specialization: "",
      availability: weekDays.map(day => ({
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
      })),
    },
  });
  
  // Keep track of which days are selected
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Filter out availability for days that weren't selected
    const finalValues = {
      ...values,
      availability: values.availability?.filter(a => selectedDays.includes(a.dayOfWeek)),
    };

    try {
      const result = await createDoctor(finalValues);
      if (result.success) {
        form.reset();
        setSelectedDays([]);
        setOpen(false);
        toast.success("Doctor added successfully!");
      } else {
        toast.error(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      toast.error("Failed to submit the form.");
    }
  }

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus /> Add New Doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Doctor Registration</DialogTitle>
          <DialogDescription>
            Complete the form to add a new doctor and set their weekly availability.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="firstName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl><Input placeholder="Emily" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="lastName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl><Input placeholder="Carter" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="e.carter@clinic.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="phoneNumber" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input type="tel" placeholder="+1 (555) 000-0000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="specialization" control={form.control} render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Specialization</FormLabel>
                  <FormControl><Input placeholder="Cardiology" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Availability Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Weekly Availability</h3>
              <div className="space-y-3">
                {form.getValues('availability')?.map((_, index) => {
                  const day = weekDays[index];
                  const isChecked = selectedDays.includes(day);
                  return (
                    <div key={day} className="grid grid-cols-12 items-center gap-4 p-2 rounded-md border">
                      <div className="col-span-3 flex items-center">
                        <Checkbox
                          id={`check-${day}`}
                          checked={isChecked}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <label htmlFor={`check-${day}`} className="ml-2 font-medium">{day}</label>
                      </div>
                      {isChecked && (
                        <>
                          <div className="col-span-4">
                            <FormField
                              control={form.control}
                              name={`availability.${index}.startTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Start Time</FormLabel>
                                  <FormControl><Input type="time" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="col-span-4">
                            <FormField
                              control={form.control}
                              name={`availability.${index}.endTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">End Time</FormLabel>
                                  <FormControl><Input type="time" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Complete Registration</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}