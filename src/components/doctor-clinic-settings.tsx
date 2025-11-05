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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Building2, Loader2, Upload } from "lucide-react";
import { getClinicSettings, updateClinicSettings } from "@/actions/treatment-actions";

const formSchema = z.object({
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicAddress: z.string().min(1, "Clinic address is required"),
  clinicPhone: z.string().min(1, "Clinic phone is required"),
  watermarkImageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export default function ManageClinicSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicName: "",
      clinicAddress: "",
      clinicPhone: "",
      watermarkImageUrl: "",
    },
  });

  // Fetch clinic settings when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const fetchSettings = async () => {
        try {
          const result = await getClinicSettings();
          if (result.success) {
            form.reset({
              clinicName: result.clinicName || "",
              clinicAddress: result.clinicAddress || "",
              clinicPhone: result.clinicPhone || "",
              watermarkImageUrl: result.watermarkImageUrl || "",
            });
          } else {
            toast.error("Failed to load clinic settings.");
          }
        } catch (error) {
          toast.error("Failed to load clinic settings.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchSettings();
    }
  }, [open, form]);

  // Image upload handler - replace with actual upload service (e.g., uploadthing, cloudinary)
  const handleImageUpload = async (file: File) => {
    console.log("Uploading file:", file.name);
    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Network delay simulate karein
      // Asli URL return karein jo upload service se milega
      const fakeUrl = `https://fake-upload-service.com/uploads/${file.name}`;
      console.log("File uploaded to:", fakeUrl);
      form.setValue("watermarkImageUrl", fakeUrl);
      toast.success("Image uploaded successfully!");
      return fakeUrl;
    } catch (error) {
      toast.error("Failed to upload image.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await updateClinicSettings({
        clinicName: values.clinicName,
        clinicAddress: values.clinicAddress,
        clinicPhone: values.clinicPhone,
        watermarkImageUrl: values.watermarkImageUrl || "",
      });

      if (result.success) {
        toast.success("Clinic settings updated successfully!");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to update clinic settings.");
      }
    } catch (error) {
      toast.error("Failed to update clinic settings.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Building2 className="mr-2 h-4 w-4" />
          Manage Clinic Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Clinic Settings</DialogTitle>
          <DialogDescription>
            Manage your clinic information for consultation forms and bills.
          </DialogDescription>
        </DialogHeader>

        {isLoading && !form.formState.isDirty ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., HealthyFlow Clinic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clinicAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 123 Main Street, City, State, ZIP"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clinicPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., +1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="watermarkImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Watermark Image (URL)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="Enter image URL or upload image"
                          {...field}
                          value={field.value || ""}
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer text-sm p-2 border rounded-md hover:bg-accent">
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    await handleImageUpload(file);
                                  } catch (error) {
                                    // Error already handled in handleImageUpload
                                  }
                                }
                              }}
                            />
                          </label>
                          {field.value && (
                            <div className="flex items-center gap-2">
                              <img
                                src={field.value}
                                alt="Watermark preview"
                                className="h-16 w-16 object-contain border rounded"
                                onError={() => {
                                  toast.error("Failed to load image. Please check the URL.");
                                }}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => form.setValue("watermarkImageUrl", "")}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

