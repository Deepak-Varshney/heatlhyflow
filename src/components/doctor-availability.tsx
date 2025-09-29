"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CalendarClock, Loader2 } from "lucide-react";
import { getDoctorAvailability, updateDoctorAvailability } from "@/actions/availability-actions";
// Import your real server actions here

// Zod schema for validation
const availabilitySchema = z.object({
  dayOfWeek: z.string(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  enabled: z.boolean().default(false),
});
const formSchema = z.object({
  schedule: z.array(availabilitySchema),
});

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// This is a placeholder for your actual server action.
// In your real code, this would fetch data from your database.


// Placeholder for the update action



export default function ManageAvailabilityDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule: weekDays.map(day => ({
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        enabled: false,
      })),
    },
  });

  // Fetch and populate the doctor's current schedule when the dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const fetchSchedule = async () => {
        try {
          // 1. Fetch the doctor's currently saved schedule rules
          const currentSchedule = await getDoctorAvailability(); 

          // 2. Create a full week's schedule, merging the existing data
          const mergedSchedule = weekDays.map(day => {
            const existingDay = currentSchedule.find((d:any) => d.dayOfWeek === day);
            if (existingDay) {
              return { ...existingDay, enabled: true };
            }
            return { dayOfWeek: day, startTime: "09:00", endTime: "17:00", enabled: false };
          });

          // 3. Reset the form with the populated data
          form.reset({ schedule: mergedSchedule });
        } catch (error) {
            toast.error("Failed to load your current schedule.");
        } finally {
            setIsLoading(false);
        }
      };
      fetchSchedule();
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Filter out the days that are not enabled to only send active rules
    const activeSchedule = values.schedule.filter(day => day.enabled);
    
    // The server action will handle updating, not creating new ones.
    const result = await updateDoctorAvailability(activeSchedule);
    
    if (result.success) {
      toast.success("Availability updated successfully!");
      setOpen(false);
    } else {
      toast.error("Failed to update availability.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
            <CalendarClock className="mr-2 h-4 w-4" />
            Manage Weekly Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Weekly Availability</DialogTitle>
          <DialogDescription>
            Select your working days and set the times. This will delete and regenerate your future available slots.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="space-y-4">
                  {weekDays.map((day, index) => (
                    <div key={day} className="grid grid-cols-12 items-center gap-x-4 gap-y-2 p-4 rounded-lg border">
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.enabled`}
                        render={({ field }) => (
                          <FormItem className="col-span-12 sm:col-span-4 flex items-center gap-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id={`check-${day}`} />
                            </FormControl>
                            <FormLabel htmlFor={`check-${day}`} className="text-base font-medium">
                              {day}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      {form.watch(`schedule.${index}.enabled`) ? (
                        <>
                          <FormField control={form.control} name={`schedule.${index}.startTime`} render={({ field }) => (
                            <FormItem className="col-span-6 sm:col-span-4">
                              <FormLabel>Start Time</FormLabel>
                              <FormControl><Input type="time" {...field} /></FormControl>
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`schedule.${index}.endTime`} render={({ field }) => (
                            <FormItem className="col-span-6 sm:col-span-4">
                              <FormLabel>End Time</FormLabel>
                              <FormControl><Input type="time" {...field} /></FormControl>
                            </FormItem>
                          )} />
                        </>
                      ) : (
                        <div className="col-span-12 sm:col-span-8 text-center text-sm text-muted-foreground py-2">
                            Not available
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Update Schedule</Button>
                </div>
              </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

