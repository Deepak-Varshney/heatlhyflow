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
import { toast } from "sonner";
import { Stethoscope, Plus, Trash2, Edit2, Loader2, DollarSign } from "lucide-react";
import {
  getDoctorTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  updateConsultationFee,
  getConsultationFee,
} from "@/app/actions/treatment-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const treatmentSchema = z.object({
  name: z.string().min(1, "Treatment name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

const consultationFeeSchema = z.object({
  consultationFee: z.coerce.number().min(0, "Fee must be positive"),
});

type ConsultationFeeFormValues = z.infer<typeof consultationFeeSchema>;

export default function ManageTreatmentsDialog() {
  const [open, setOpen] = useState(false);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [isLoadingFee, setIsLoadingFee] = useState(false);

  const treatmentForm = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema as any),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  const feeForm = useForm<ConsultationFeeFormValues>({
    resolver: zodResolver(consultationFeeSchema as any),
    defaultValues: {
      consultationFee: 0,
    },
  });

  // Fetch treatments and consultation fee when dialog opens
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [treatmentsData, feeData] = await Promise.all([
        getDoctorTreatments(),
        getConsultationFee(),
      ]);
      setTreatments(treatmentsData);
      if (feeData.success && feeData.consultationFee) {
        setConsultationFee(feeData.consultationFee);
        feeForm.reset({ consultationFee: feeData.consultationFee });
      }
    } catch (error) {
      toast.error("Failed to load treatments");
    } finally {
      setIsLoading(false);
    }
  };

  const onTreatmentSubmit = async (values: TreatmentFormValues) => {
    if (editingId) {
      // Update existing treatment
      const result = await updateTreatment(editingId, values);
      if (result.success) {
        toast.success("Treatment updated successfully!");
        setEditingId(null);
        treatmentForm.reset();
        fetchData();
      } else {
        toast.error(result.error || "Failed to update treatment");
      }
    } else {
      // Create new treatment
      const result = await createTreatment(values);
      if (result.success) {
        toast.success("Treatment added successfully!");
        treatmentForm.reset();
        fetchData();
      } else {
        toast.error(result.error || "Failed to add treatment");
      }
    }
  };

  const onDeleteTreatment = async (treatmentId: string) => {
    if (!confirm("Are you sure you want to delete this treatment?")) {
      return;
    }
    const result = await deleteTreatment(treatmentId);
    if (result.success) {
      toast.success("Treatment deleted successfully!");
      fetchData();
    } else {
      toast.error(result.error || "Failed to delete treatment");
    }
  };

  const onEditTreatment = (treatment: any) => {
    setEditingId(treatment._id);
    treatmentForm.reset({
      name: treatment.name,
      price: treatment.price,
    });
  };

  const onCancelEdit = () => {
    setEditingId(null);
    treatmentForm.reset();
  };

  const onFeeSubmit = async (values: ConsultationFeeFormValues) => {
    setIsLoadingFee(true);
    try {
      const result = await updateConsultationFee(values.consultationFee);
      if (result.success) {
        toast.success("Consultation fee updated successfully!");
        setConsultationFee(values.consultationFee);
      } else {
        toast.error(result.error || "Failed to update consultation fee");
      }
    } catch (error) {
      toast.error("Failed to update consultation fee");
    } finally {
      setIsLoadingFee(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Stethoscope className="mr-2 h-4 w-4" />
          Manage Treatments & Fees
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Treatments & Consultation Fee</DialogTitle>
          <DialogDescription>
            Add and manage your available treatments and consultation fees.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Consultation Fee Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Consultation Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...feeForm}>
                <form
                  onSubmit={feeForm.handleSubmit(onFeeSubmit)}
                  className="flex gap-4 items-end"
                >
                  <FormField
                    control={feeForm.control}
                    name="consultationFee"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Default Consultation Fee</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 500"
                            step="0.01"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoadingFee}>
                    {isLoadingFee ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Update Fee"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Add/Edit Treatment Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Treatment" : "Add New Treatment"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...treatmentForm}>
                <form
                  onSubmit={treatmentForm.handleSubmit(onTreatmentSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={treatmentForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Treatment Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Root Canal"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={treatmentForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 5000"
                              step="0.01"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingId ? (
                        <>
                          <Edit2 className="mr-2 h-4 w-4" /> Update
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Add Treatment
                        </>
                      )}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onCancelEdit}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Treatments List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Treatments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : treatments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No treatments added yet. Add your first treatment above.
                </p>
              ) : (
                <div className="space-y-2">
                  {treatments.map((treatment) => (
                    <div
                      key={treatment._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{treatment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{treatment.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onEditTreatment(treatment)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteTreatment(treatment._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

