"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
// import { createPrescription } from "@/actions/prescription-actions";

// Zod schema for validation
const formSchema = z.object({
  medicines: z.array(z.object({
    name: z.string().min(1, "Medicine name is required."),
    dosage: z.string().min(1, "Dosage is required."),
    timings: z.object({
      morning: z.boolean().default(false),
      afternoon: z.boolean().default(false),
      night: z.boolean().default(false),
    }),
  })).optional(),
  tests: z.array(z.object({
    name: z.string().min(1, "Test name is required."),
  })).optional(),
  notes: z.string().optional(),
});

export function PrescriptionForm({ appointmentId }: { appointmentId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicines: [{ name: "", dosage: "", timings: { morning: true, afternoon: false, night: true } }],
      tests: [{ name: "" }],
      notes: "",
    },
  });

  const { fields: medFields, append: appendMed, remove: removeMed } = useFieldArray({
    control: form.control, name: "medicines",
  });
  const { fields: testFields, append: appendTest, remove: removeTest } = useFieldArray({
    control: form.control, name: "tests",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // const result = await createPrescription({ appointmentId, ...values });
    // if (result.success) {
    //   toast.success("Prescription saved successfully!");
    // } else {
    //   toast.error(result.error);
    // }
    console.log(values); // For testing
    toast.success("Prescription saved successfully!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Medicines Section */}
        <Card>
          <CardHeader>
            <CardTitle>Medicines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 border p-4 rounded-md">
                <FormField control={form.control} name={`medicines.${index}.name`} render={({ field }) => (
                  <FormItem className="col-span-12 sm:col-span-4"><FormLabel>Name</FormLabel><FormControl><Input placeholder="Paracetamol" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`medicines.${index}.dosage`} render={({ field }) => (
                  <FormItem className="col-span-12 sm:col-span-2"><FormLabel>Dosage</FormLabel><FormControl><Input placeholder="500mg" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormItem className="col-span-12 sm:col-span-5"><FormLabel>Timings</FormLabel>
                    <div className="flex items-center space-x-4 pt-2">
                       <FormField control={form.control} name={`medicines.${index}.timings.morning`} render={({ field }) => (
                         <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Morning</FormLabel></FormItem>
                       )} />
                       <FormField control={form.control} name={`medicines.${index}.timings.afternoon`} render={({ field }) => (
                         <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Afternoon</FormLabel></FormItem>
                       )} />
                       <FormField control={form.control} name={`medicines.${index}.timings.night`} render={({ field }) => (
                         <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Night</FormLabel></FormItem>
                       )} />
                    </div>
                </FormItem>
                <div className="col-span-12 sm:col-span-1 flex items-end">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeMed(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendMed({ name: "", dosage: "", timings: { morning: true, afternoon: false, night: true } })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Medicine
            </Button>
          </CardContent>
        </Card>

        {/* Tests Section */}
        <Card>
           <CardHeader><CardTitle>Tests</CardTitle></CardHeader>
           <CardContent className="space-y-4">
              {testFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                      <FormField control={form.control} name={`tests.${index}.name`} render={({ field }) => (
                         <FormItem className="flex-1"><FormLabel>Test Name</FormLabel><FormControl><Input placeholder="Blood Test" {...field} /></FormControl><FormMessage /></FormItem>
                       )} />
                       <Button type="button" variant="destructive" size="icon" onClick={() => removeTest(index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
              ))}
               <Button type="button" variant="outline" size="sm" onClick={() => appendTest({ name: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Test
                </Button>
           </CardContent>
        </Card>

        {/* Notes Section */}
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem><FormLabel>Additional Notes</FormLabel><FormControl><Textarea placeholder="Advised bed rest for 3 days..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <Button type="submit">Save Prescription</Button>
      </form>
    </Form>
  );
}
