"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Download } from "lucide-react";
import { getOnboardingRequests, approveOnboardingRequest, rejectOnboardingRequest } from "@/app/actions/onboarding-request-actions";

interface OnboardingRequestData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  organizationType: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvalDate?: string;
  rejectionReason?: string;
}

export default function JoinRequestsPage() {
  const [requests, setRequests] = useState<OnboardingRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");

  // Dialog states
  const [selectedRequest, setSelectedRequest] = useState<OnboardingRequestData | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load requests
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const result = await getOnboardingRequests();
    if (result.success) {
      setRequests(result.requests || []);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    const result = await approveOnboardingRequest(selectedRequest._id);

    if (result.success) {
      setApproveDialogOpen(false);
      setSelectedRequest(null);
      await loadRequests();
    } else {
      alert(`Error: ${result.error}`);
    }
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    const result = await rejectOnboardingRequest(selectedRequest._id, rejectionReason);

    if (result.success) {
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
      await loadRequests();
    } else {
      alert(`Error: ${result.error}`);
    }
    setIsProcessing(false);
  };

  const filterRequests = (status: string) =>
    requests.filter((req) => req.status === status);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "REJECTED":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const pendingCount = filterRequests("PENDING").length;
  const approvedCount = filterRequests("APPROVED").length;
  const rejectedCount = filterRequests("REJECTED").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Join Requests</h1>
          <p className="text-gray-600">Review and approve new clinic/hospital onboarding requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>View, approve, or reject pending applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="PENDING">
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="APPROVED">
                  Approved ({approvedCount})
                </TabsTrigger>
                <TabsTrigger value="REJECTED">
                  Rejected ({rejectedCount})
                </TabsTrigger>
              </TabsList>

              {/* Pending Tab */}
              <TabsContent value="PENDING" className="space-y-4 mt-6">
                {filterRequests("PENDING").length === 0 ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>No pending requests at the moment</AlertDescription>
                  </Alert>
                ) : (
                  filterRequests("PENDING").map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      onApprove={() => {
                        setSelectedRequest(request);
                        setApproveDialogOpen(true);
                      }}
                      onReject={() => {
                        setSelectedRequest(request);
                        setRejectDialogOpen(true);
                      }}
                    />
                  ))
                )}
              </TabsContent>

              {/* Approved Tab */}
              <TabsContent value="APPROVED" className="space-y-4 mt-6">
                {filterRequests("APPROVED").length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>No approved requests yet</AlertDescription>
                  </Alert>
                ) : (
                  filterRequests("APPROVED").map((request) => (
                    <RequestCardStatic key={request._id} request={request} />
                  ))
                )}
              </TabsContent>

              {/* Rejected Tab */}
              <TabsContent value="REJECTED" className="space-y-4 mt-6">
                {filterRequests("REJECTED").length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>No rejected requests</AlertDescription>
                  </Alert>
                ) : (
                  filterRequests("REJECTED").map((request) => (
                    <RequestCardStatic key={request._id} request={request} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              You are about to approve {selectedRequest?.firstName} {selectedRequest?.lastName}'s
              application to join HealthyFlow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-900">Request Details:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Name:</span> {selectedRequest?.firstName}{" "}
                  {selectedRequest?.lastName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {selectedRequest?.email}
                </div>
                <div>
                  <span className="font-medium">Organization:</span> {selectedRequest?.organizationName}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {selectedRequest?.organizationType}
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                An account will be created in Clerk and the applicant will receive an approval
                email with login instructions.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Approve Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              You are about to reject {selectedRequest?.firstName} {selectedRequest?.lastName}'s
              application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why you are rejecting this application..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
              />
            </div>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The applicant will receive an email with your rejection reason.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? "Processing..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: OnboardingRequestData;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {request.firstName} {request.lastName}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-medium text-gray-900">Email:</span>
              <p>{request.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Phone:</span>
              <p>{request.phone}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Organization:</span>
              <p>{request.organizationName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Type:</span>
              <p>{request.organizationType}</p>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Submitted: {new Date(request.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={onApprove}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onReject}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

function RequestCardStatic({ request }: { request: OnboardingRequestData }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {request.firstName} {request.lastName}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-medium text-gray-900">Email:</span>
              <p>{request.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Phone:</span>
              <p>{request.phone}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Organization:</span>
              <p>{request.organizationName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Type:</span>
              <p>{request.organizationType}</p>
            </div>
          </div>

          {request.rejectionReason && (
            <div className="bg-red-50 rounded p-2 mb-2">
              <p className="text-xs font-medium text-red-900">Rejection Reason:</p>
              <p className="text-xs text-red-700">{request.rejectionReason}</p>
            </div>
          )}

          <div className="text-xs text-gray-500">
            {request.status === "APPROVED"
              ? `Approved: ${new Date(request.approvalDate || "").toLocaleString()}`
              : `Submitted: ${new Date(request.createdAt).toLocaleString()}`}
          </div>
        </div>
      </div>
    </div>
  );
}
