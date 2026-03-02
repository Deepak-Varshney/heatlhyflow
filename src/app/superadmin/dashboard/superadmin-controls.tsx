"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrganizationAsSuperadmin, moveUserToOrganization } from "@/actions/superadmin-actions";

interface OrganizationOption {
  _id: string;
  name: string;
  status: "PENDING" | "ACTIVE" | "DISABLED" | "REJECTED";
}

interface UserOption {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization?: { _id: string; name: string } | null;
}

interface SuperadminControlsProps {
  organizations: OrganizationOption[];
  movableUsers: UserOption[];
}

export default function SuperadminControls({ organizations, movableUsers }: SuperadminControlsProps) {
  const [pending, startTransition] = useTransition();

  // Organization creation fields
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState<"CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME">("CLINIC");
  
  // Owner/Doctor details
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerSpecialty, setOwnerSpecialty] = useState("");
  const [ownerExperience, setOwnerExperience] = useState("");

  // Move user fields
  const [targetUserId, setTargetUserId] = useState<string>("NONE");
  const [targetOrganizationId, setTargetOrganizationId] = useState<string>("NONE");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateOrganization = () => {
    setError(null);
    setMessage(null);

    // Validation
    if (!organizationName.trim()) {
      setError("Organization name is required");
      return;
    }
    if (!ownerFirstName.trim() || !ownerLastName.trim()) {
      setError("Owner's first and last name are required");
      return;
    }
    if (!ownerEmail.trim()) {
      setError("Owner's email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!ownerPhone.trim()) {
      setError("Owner's phone number is required");
      return;
    }

    startTransition(async () => {
      const result = await createOrganizationAsSuperadmin({
        name: organizationName,
        type: organizationType,
        ownerDetails: {
          firstName: ownerFirstName,
          lastName: ownerLastName,
          email: ownerEmail,
          phone: ownerPhone,
          specialty: ownerSpecialty || undefined,
          yearsOfExperience: ownerExperience ? parseInt(ownerExperience) : undefined,
        },
      });

      if (!result.success) {
        setError(result.error || "Failed to create organization");
        return;
      }

      // Reset form
      setOrganizationName("");
      setOwnerFirstName("");
      setOwnerLastName("");
      setOwnerEmail("");
      setOwnerPhone("");
      setOwnerSpecialty("");
      setOwnerExperience("");
      setMessage(result.message || "Organization created");
    });
  };

  const handleMoveUser = () => {
    setError(null);
    setMessage(null);

    if (targetUserId === "NONE" || targetOrganizationId === "NONE") {
      setError("Please select both user and organization");
      return;
    }

    startTransition(async () => {
      const result = await moveUserToOrganization(targetUserId, targetOrganizationId);

      if (!result.success) {
        setError(result.error || "Failed to move user");
        return;
      }

      setTargetUserId("NONE");
      setTargetOrganizationId("NONE");
      setMessage(result.message || "User moved successfully");
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Organization & Owner</CardTitle>
          <CardDescription>Create a new organization and owner account in one step.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Organization Details */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-semibold mb-3">Organization Details</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  value={organizationName}
                  onChange={(event) => setOrganizationName(event.target.value)}
                  placeholder="e.g., City Medical Center"
                  disabled={pending}
                />
              </div>

              <div className="space-y-1">
                <Label>Organization Type *</Label>
                <Select value={organizationType} onValueChange={(value) => setOrganizationType(value as typeof organizationType)} disabled={pending}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLINIC">Clinic</SelectItem>
                    <SelectItem value="HOSPITAL">Hospital</SelectItem>
                    <SelectItem value="PRIVATE_PRACTICE">Private Practice</SelectItem>
                    <SelectItem value="NURSING_HOME">Nursing Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Owner/Doctor Details */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Owner/Doctor Details</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ownerFirstName">First Name *</Label>
                  <Input
                    id="ownerFirstName"
                    value={ownerFirstName}
                    onChange={(event) => setOwnerFirstName(event.target.value)}
                    placeholder="John"
                    disabled={pending}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ownerLastName">Last Name *</Label>
                  <Input
                    id="ownerLastName"
                    value={ownerLastName}
                    onChange={(event) => setOwnerLastName(event.target.value)}
                    placeholder="Doe"
                    disabled={pending}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="ownerEmail">Email *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={ownerEmail}
                  onChange={(event) => setOwnerEmail(event.target.value)}
                  placeholder="doctor@example.com"
                  disabled={pending}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ownerPhone">Phone Number *</Label>
                <Input
                  id="ownerPhone"
                  value={ownerPhone}
                  onChange={(event) => setOwnerPhone(event.target.value)}
                  placeholder="+1 234 567 8900"
                  disabled={pending}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ownerSpecialty">Specialty (Optional)</Label>
                  <Input
                    id="ownerSpecialty"
                    value={ownerSpecialty}
                    onChange={(event) => setOwnerSpecialty(event.target.value)}
                    placeholder="e.g., Cardiology"
                    disabled={pending}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ownerExperience">Years of Experience (Optional)</Label>
                  <Input
                    id="ownerExperience"
                    type="number"
                    min="0"
                    value={ownerExperience}
                    onChange={(event) => setOwnerExperience(event.target.value)}
                    placeholder="10"
                    disabled={pending}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateOrganization}
            disabled={pending || !organizationName.trim() || !ownerFirstName.trim() || !ownerLastName.trim() || !ownerEmail.trim() || !ownerPhone.trim()}
            className="w-full"
          >
            {pending ? "Creating..." : "Create Organization & Owner"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Move User to Organization</CardTitle>
          <CardDescription>Re-assign doctors/receptionists between organizations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>User</Label>
            <Select value={targetUserId} onValueChange={setTargetUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Select user</SelectItem>
                {movableUsers.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} · {user.organization?.name ?? "No org"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Target Organization</Label>
            <Select value={targetOrganizationId} onValueChange={setTargetOrganizationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Select organization</SelectItem>
                {organizations.map((organization) => (
                  <SelectItem key={organization._id} value={organization._id}>
                    {organization.name} ({organization.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleMoveUser}
            disabled={pending || targetUserId === "NONE" || targetOrganizationId === "NONE"}
            className="w-full"
            variant="outline"
          >
            {pending ? "Moving..." : "Move User"}
          </Button>
        </CardContent>
      </Card>

      {(error || message) ? (
        <div className="xl:col-span-2 rounded-md border px-4 py-3 text-sm">
          {error ? <p className="text-red-600">{error}</p> : null}
          {message ? <p className="text-emerald-600">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
