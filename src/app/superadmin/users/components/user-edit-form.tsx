"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/actions/superadmin-actions";
import { DevilAlert } from "./devil-alert";

interface UserEditFormProps {
  user: any;
  onClose: () => void;
  currentUserRole?: string;
}

export function UserEditForm({ user, onClose, currentUserRole }: UserEditFormProps) {
  const [devilAlertOpen, setDevilAlertOpen] = useState(false);

  const checkDevilPermission = () => {
    // If target user is SUPERADMIN and current user is not DEVIL, show devil alert
    if (user.role === "SUPERADMIN" && currentUserRole !== "DEVIL") {
      setDevilAlertOpen(true);
      return false;
    }
    return true;
  };

  async function handleSubmit(formData: FormData) {
    if (!checkDevilPermission()) return;

    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      role: formData.get("role") as any,
      specialty: formData.get("specialty") as string,
      experience: parseInt(formData.get("experience") as string) || 0,
      description: formData.get("description") as string,
      verificationStatus: formData.get("verificationStatus") as any,
    };

    await updateUser(user._id, data);
    onClose();
  }

  return (
    <>
      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input name="firstName" defaultValue={user.firstName} required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input name="lastName" defaultValue={user.lastName} required />
          </div>
        </div>
{/* 
        <div>
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" defaultValue={user.email} required />
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={user.role}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                <SelectItem value="DOCTOR">Doctor</SelectItem>
                {/* <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                <SelectItem value="DEVIL">🔥 DEVIL 🔥</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="verificationStatus">Verification Status</Label>
            <Select name="verificationStatus" defaultValue={user.verificationStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {user.role === "DOCTOR" && (
          <>
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Input name="specialty" defaultValue={user.specialty || ""} />
            </div>
            <div>
              <Label htmlFor="experience">Experience (years)</Label>
              <Input name="experience" type="number" defaultValue={user.experience || 0} />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" defaultValue={user.description || ""} />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Update User</Button>
        </div>
      </form>

      {/* Devil Alert Dialog */}
      <DevilAlert
        isOpen={devilAlertOpen}
        onClose={() => setDevilAlertOpen(false)}
        targetUser={user}
        action="edit"
      />
    </>
  );
}
