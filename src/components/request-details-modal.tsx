"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  approveOnboardingRequest,
  rejectOnboardingRequest,
} from "@/actions/onboarding-request-actions";

export function RequestDetailsModal({ request }: { request: any }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"approve" | "reject" | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const requestId = String(request._id ?? "");
  const isBusy = isPending || activeAction !== null;

  const operatingHours = (() => {
    if (request.operatingHours) return request.operatingHours;
    if (request.operatingHoursStart || request.operatingHoursEnd) {
      return `${request.operatingHoursStart || ""} - ${request.operatingHoursEnd || ""}`.trim();
    }
    return null;
  })();

  const handleApprove = () => {
    setErrorMessage(null);
    setActiveAction("approve");
    startTransition(async () => {
      try {
        await approveOnboardingRequest(requestId);
        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        setErrorMessage("Unable to approve the request. Please try again.");
      } finally {
        setActiveAction(null);
      }
    });
  };

  const handleReject = () => {
    setErrorMessage(null);
    setActiveAction("reject");
    startTransition(async () => {
      try {
        const rejectionReason = reason.trim() || "Not approved";
        await rejectOnboardingRequest(requestId, rejectionReason);
        setOpen(false);
        setReason("");
        router.refresh();
      } catch (error) {
        console.error(error);
        setErrorMessage("Unable to reject the request. Please try again.");
      } finally {
        setActiveAction(null);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-full border border-primary/20 bg-primary/5 p-0 text-primary hover:bg-primary/10"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-primary/15 bg-linear-to-br from-primary/10 via-background/85 to-background/70 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_55%)]" />
        <div className="relative space-y-6">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <DialogTitle>Onboarding Request Details</DialogTitle>
                <DialogDescription>
                  Complete information for {request.organizationName}
                </DialogDescription>
              </div>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                {request.status || "PENDING"}
              </Badge>
            </div>
          </DialogHeader>

          {/* Organization Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground">
              Organization Information
            </h3>
            <div className="rounded-2xl border border-primary/10 bg-background/70 p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Organization Name:</span>
                  <span className="text-sm font-medium">{request.organizationName}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Organization Type:</span>
                  <Badge variant="secondary">{request.organizationType}</Badge>
                </div>
              {request.staffCount && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Staff Count:</span>
                  <span className="text-sm font-medium">{request.staffCount}</span>
                </div>
              )}
                {operatingHours && (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">Operating Hours:</span>
                    <span className="text-sm font-medium">{operatingHours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground">
              Contact Information
            </h3>
            <div className="rounded-2xl border border-primary/10 bg-background/70 p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="text-sm font-medium">
                    {request.firstName} {request.lastName}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm font-medium">{request.email}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="text-sm font-medium">{request.phone}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <span className="text-sm font-medium text-right max-w-xs">
                    {request.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground">
              Professional Information
            </h3>
            <div className="rounded-2xl border border-primary/10 bg-background/70 p-4 shadow-sm">
              <div className="space-y-2">
              {request.specialty && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Specialty:</span>
                  <span className="text-sm font-medium">{request.specialty}</span>
                </div>
              )}
              {request.yearsOfExperience !== undefined && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Years of Experience:</span>
                  <span className="text-sm font-medium">{request.yearsOfExperience}</span>
                </div>
              )}
              {request.treatments && (
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Services/Treatments:</span>
                  <div className="text-sm font-medium text-right max-w-xs">
                    {Array.isArray(request.treatments)
                      ? request.treatments.join(", ")
                      : request.treatments}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Submission Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground">
              Submission Details
            </h3>
            <div className="rounded-2xl border border-primary/10 bg-background/70 p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Submitted:</span>
                  <span className="text-sm font-medium">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="outline">{request.status || "PENDING"}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-background/70 p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Approval Actions</h4>
                  <p className="text-xs text-muted-foreground">
                    Approve to create the organization or reject with a reason.
                  </p>
                </div>
              </div>
              <Textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Add a rejection reason (optional)"
                className="min-h-24 bg-background/80"
                disabled={isBusy}
              />
              {errorMessage && (
                <p className="text-xs text-rose-600">{errorMessage}</p>
              )}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isBusy}
                >
                  {activeAction === "reject" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Rejecting
                    </span>
                  ) : (
                    "Reject"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleApprove}
                  disabled={isBusy}
                >
                  {activeAction === "approve" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Approving
                    </span>
                  ) : (
                    "Approve"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
