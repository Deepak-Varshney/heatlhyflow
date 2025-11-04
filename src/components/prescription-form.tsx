// "use client";

// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { PlusCircle, Trash2, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { createPrescription } from "@/actions/appointment-actions"; // Server action ko import karein

// const formSchema = z.object({
//   chiefComplaint: z.string().min(5, "Please enter the patient&apos;s main problem."),
//   medicines: z.array(z.object({
//     name: z.string().min(1, "Medicine name is required."),
//     dosage: z.string().min(1, "Dosage is required."),
//     timings: z.object({
//       morning: z.boolean().default(false),
//       afternoon: z.boolean().default(false),
//       night: z.boolean().default(false),
//     }),
//   })).optional(),
//   tests: z.array(z.object({
//     name: z.string().min(1, "Test name is required."),
//   })).optional(),
//   notes: z.string().optional(),
// });

// export function PrescriptionForm({
//   appointmentId,
//   patientId,
//   onSaveSuccess,
// }: {
//   appointmentId: string;
//   patientId: string;
//   onSaveSuccess: () => void; // Naya prop
// }) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       chiefComplaint: "",
//       medicines: [{ name: "", dosage: "", timings: { morning: true, afternoon: false, night: true } }],
//       tests: [],
//       notes: "",
//     },
//   });

//   const { fields: medFields, append: appendMed, remove: removeMed } = useFieldArray({
//     control: form.control, name: "medicines",
//   });
//   const { fields: testFields, append: appendTest, remove: removeTest } = useFieldArray({
//     control: form.control, name: "tests",
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     const result = await createPrescription({ appointmentId, patientId, ...values });
//     if (result.success) {
//       toast.success("Prescription saved successfully!");
//       onSaveSuccess(); // Success hone par callback function ko call karein
//     } else {
//       toast.error(result.error || "Failed to save prescription.");
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Patient's Complaint & Diagnosis</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <FormField control={form.control} name="chiefComplaint" render={({ field }) => (
//               <FormItem>
//                 <FormControl><Textarea placeholder="e.g., Fever and headache for 3 days..." {...field} /></FormControl>
//                 <FormMessage />
//               </FormItem>
//             )} />
//           </CardContent>
//         </Card>

//         {/* Dawaiyon ka section */}
//         <Card>
//           <CardHeader><CardTitle>Medicines</CardTitle></CardHeader>
//           <CardContent className="space-y-4">
//             {medFields.map((field, index) => (
//               <div key={field.id} className="grid grid-cols-12 gap-4 border p-4 rounded-md items-end">
//                 <FormField control={form.control} name={`medicines.${index}.name`} render={({ field }) => (
//                   <FormItem className="col-span-12 sm:col-span-4"><FormLabel>Name</FormLabel><FormControl><Input placeholder="Paracetamol" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name={`medicines.${index}.dosage`} render={({ field }) => (
//                   <FormItem className="col-span-12 sm:col-span-2"><FormLabel>Dosage</FormLabel><FormControl><Input placeholder="500mg" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormItem className="col-span-12 sm:col-span-5"><FormLabel>Timings</FormLabel>
//                     <div className="flex items-center space-x-4 pt-2">
//                        <FormField control={form.control} name={`medicines.${index}.timings.morning`} render={({ field }) => (
//                          <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Morning</FormLabel></FormItem>
//                        )} />
//                        <FormField control={form.control} name={`medicines.${index}.timings.afternoon`} render={({ field }) => (
//                          <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Afternoon</FormLabel></FormItem>
//                        )} />
//                        <FormField control={form.control} name={`medicines.${index}.timings.night`} render={({ field }) => (
//                          <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Night</FormLabel></FormItem>
//                        )} />
//                     </div>
//                 </FormItem>
//                 <div className="col-span-12 sm:col-span-1 flex items-end">
//                     <Button type="button" variant="destructive" size="icon" onClick={() => removeMed(index)}><Trash2 className="h-4 w-4" /></Button>
//                 </div>
//               </div>
//             ))}
//             <Button type="button" variant="outline" size="sm" onClick={() => appendMed({ name: "", dosage: "", timings: { morning: false, afternoon: false, night: false } })}>
//               <PlusCircle className="mr-2 h-4 w-4" /> Add Medicine
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Baki sections... */}
//         <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
//           {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Prescription & End Consultation"}
//         </Button>
//       </form>
//     </Form>
//   );
// }


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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle, Trash2, Loader2, Upload, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { createPrescription } from "@/actions/appointment-actions";
import { getDoctorTreatments, getConsultationFee } from "@/actions/treatment-actions";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  chiefComplaint: z.string().min(5, "Please enter the patient&apos;s main problem."),
  diagnosis: z.string().min(5, "Please enter your diagnosis."), // NAYA FIELD
  medicines: z
    .array(
      z.object({
        name: z.string().min(1, "Medicine name is required."),
        dosage: z.string().min(1, "Dosage is required."),
        timings: z.object({
          morning: z.boolean().default(false),
          afternoon: z.boolean().default(false),
          night: z.boolean().default(false),
        }),
      })
    )
    .optional(),
  tests: z.array(z.object({
    name: z.string().min(1, "Test name is required."),
    notes: z.string().optional(),
    reportImageUrl: z.string().url().optional().or(z.literal('')), // Report URL ke liye
    price: z.coerce.number().min(0).optional(),
  })).optional(),
  notes: z.string().optional(),
  treatments: z.array(z.object({
    treatmentId: z.string(),
    name: z.string(),
    price: z.number(),
  })).optional(),
  doctorFee: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).optional(),
});

export function PrescriptionForm({
  appointmentId,
  patientId,
  onSaveSuccess,
}: {
  appointmentId: string;
  patientId: string;
  onSaveSuccess: () => void;
}) {
  const [availableTreatments, setAvailableTreatments] = useState<any[]>([]);
  const [defaultFee, setDefaultFee] = useState<number>(0);
  const [isLoadingTreatments, setIsLoadingTreatments] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chiefComplaint: "",
      diagnosis: "",
      medicines: [
        {
          name: "",
          dosage: "",
          timings: { morning: true, afternoon: false, night: true },
        },
      ],
      tests: [],
      notes: "",
      treatments: [],
      doctorFee: 0,
      discount: 0,
    },
  });

  // Fetch treatments and default consultation fee
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTreatments(true);
      try {
        const [treatments, feeData] = await Promise.all([
          getDoctorTreatments(),
          getConsultationFee(),
        ]);
        setAvailableTreatments(treatments);
        if (feeData.success && feeData.consultationFee) {
          setDefaultFee(feeData.consultationFee);
          form.setValue("doctorFee", feeData.consultationFee);
        }
      } catch (error) {
        toast.error("Failed to load treatments");
      } finally {
        setIsLoadingTreatments(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    fields: medFields,
    append: appendMed,
    remove: removeMed,
  } = useFieldArray({
    control: form.control,
    name: "medicines",
  });
  const { fields: testFields, append: appendTest, remove: removeTest, update: updateTest } = useFieldArray({
    control: form.control, name: "tests",
  });
  const { fields: treatmentFields, append: appendTreatment, remove: removeTreatment } = useFieldArray({
    control: form.control, name: "treatments",
  });
  const [isUploading, setIsUploading] = useState<number | null>(null);
  
  // Calculate total amount
  const treatments = form.watch("treatments") || [];
  const tests = form.watch("tests") || [];
  const doctorFee = form.watch("doctorFee") || 0;
  const discount = form.watch("discount") || 0;
  const treatmentsTotal = treatments.reduce((sum, t) => sum + (t.price || 0), 0);
  const testsTotal = tests.reduce((sum, t) => sum + (t.price || 0), 0);
  const totalAmount = treatmentsTotal + testsTotal + doctorFee - discount;
  
  // Image upload handler - replace with actual upload service (e.g., uploadthing, cloudinary)
  const handleImageUpload = async (file: File) => {
    console.log("Uploading file:", file.name);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Network delay simulate karein
    // Asli URL return karein jo upload service se milega
    const fakeUrl = `https://fake-upload-service.com/uploads/${file.name}`;
    console.log("File uploaded to:", fakeUrl);
    return fakeUrl;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createPrescription({
      appointmentId,
      patientId,
      ...values,
    });
    if (result.success) {
      toast.success("Prescription saved successfully!");
      onSaveSuccess();
    } else {
      toast.error(result.error || "Failed to save prescription.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Patient&rsquo;s Complaint & Diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="chiefComplaint" render={({ field }) => (
              <FormItem>
                <FormLabel>Patient&rsquo;s Chief Complaint</FormLabel>
                <FormControl><Textarea placeholder="e.g., Fever and headache for 3 days..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="diagnosis" render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor&rsquo;s Diagnosis</FormLabel>
                <FormControl><Textarea placeholder="e.g., Viral fever, acute pharyngitis." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* Dawaiyon ka section */}
        <Card>
          <CardHeader>
            <CardTitle>Medicines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-4 border p-4 rounded-md items-end"
              >
                <FormField
                  control={form.control}
                  name={`medicines.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="col-span-12 sm:col-span-4">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Paracetamol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`medicines.${index}.dosage`}
                  render={({ field }) => (
                    <FormItem className="col-span-12 sm:col-span-2">
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="col-span-12 sm:col-span-5">
                  <FormLabel>Timings</FormLabel>
                  <div className="flex items-center space-x-4 pt-2">
                    <FormField
                      control={form.control}
                      name={`medicines.${index}.timings.morning`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Morning</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`medicines.${index}.timings.afternoon`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Afternoon</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`medicines.${index}.timings.night`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Night</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </FormItem>
                <div className="col-span-12 sm:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeMed(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendMed({
                  name: "",
                  dosage: "",
                  timings: {
                    morning: false,
                    afternoon: false,
                    night: false,
                  },
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Medicine
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recommended Tests & Reports</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {testFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold pt-2">Test #{index + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeTest(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name={`tests.${index}.name`} render={({ field }) => (
                    <FormItem><FormLabel>Test Name</FormLabel><FormControl><Input placeholder="e.g., Complete Blood Count (CBC)" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  <FormField control={form.control} name={`tests.${index}.price`} render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      field.onChange(value);
                    }} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name={`tests.${index}.notes`} render={({ field }) => (
                  <FormItem><FormLabel>Notes for Test</FormLabel><FormControl><Textarea placeholder="e.g., Fasting required for 8 hours." {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name={`tests.${index}.reportImageUrl`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Report</FormLabel>
                    {field.value ? (
                      <div className="flex items-center gap-2">
                        <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">View Uploaded Report</a>
                      </div>
                    ) : (
                      <FormControl>
                        <label className="flex items-center gap-2 cursor-pointer text-sm p-2 border rounded-md">
                          {isUploading === index ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          <span>{isUploading === index ? "Uploading..." : "Choose File"}</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setIsUploading(index);
                                try {
                                  const uploadedUrl = await handleImageUpload(file);
                                  // Form state mein URL update karein
                                  const currentTest = form.getValues(`tests.${index}`);
                                  updateTest(index, { ...currentTest, reportImageUrl: uploadedUrl });
                                } catch (err) {
                                  toast.error("File upload failed.");
                                } finally {
                                  setIsUploading(null);
                                }
                              }
                            }}
                          />
                        </label>
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendTest({ name: "", notes: "", reportImageUrl: "", price: 0 })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Test
            </Button>
          </CardContent>
        </Card>

        {/* Treatments & Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Treatments & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Treatments Selection */}
            <div className="space-y-4">
              <FormLabel>Treatments</FormLabel>
              {treatmentFields.map((field, index) => {
                return (
                  <div key={field.id} className="grid grid-cols-12 gap-4 border p-4 rounded-md items-end">
                    <FormField
                      control={form.control}
                      name={`treatments.${index}.treatmentId`}
                      render={({ field }) => (
                        <FormItem className="col-span-12 sm:col-span-5">
                          <FormLabel>Treatment</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const treatment = availableTreatments.find((t) => t._id === value);
                              if (treatment) {
                                form.setValue(`treatments.${index}.treatmentId`, treatment._id);
                                form.setValue(`treatments.${index}.name`, treatment.name);
                                form.setValue(`treatments.${index}.price`, treatment.price);
                              }
                            }}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select treatment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableTreatments.map((treatment) => (
                                <SelectItem key={treatment._id} value={treatment._id}>
                                  {treatment.name} - ₹{treatment.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`treatments.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="col-span-12 sm:col-span-4">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-12 sm:col-span-3 flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeTreatment(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTreatment({ treatmentId: "", name: "", price: 0 })}
                disabled={isLoadingTreatments}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Treatment
              </Button>
            </div>

            {/* Doctor Fee & Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="doctorFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor Consultation Fee</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total Amount Display */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary">₹{Math.max(0, totalAmount).toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                {treatmentsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Treatments:</span>
                    <span>₹{treatmentsTotal.toFixed(2)}</span>
                  </div>
                )}
                {testsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Tests:</span>
                    <span>₹{testsTotal.toFixed(2)}</span>
                  </div>
                )}
                {doctorFee > 0 && (
                  <div className="flex justify-between">
                    <span>Consultation Fee:</span>
                    <span>₹{doctorFee.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save Prescription & End Consultation"
          )}
        </Button>
      </form>
    </Form>
  );
}
