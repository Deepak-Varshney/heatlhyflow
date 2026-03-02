"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { permanentlyDeleteUser, updateUser } from "@/actions/superadmin-actions";

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

interface UserDetailsModalProps {
  user: any;
}

export function UserDetailsModal({ user }: UserDetailsModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateVerificationStatus = async (status: VerificationStatus) => {
    if (isUpdating || isDeleting) return;

    try {
      setIsUpdating(true);
      await updateUser(user._id, { verificationStatus: status });
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || isUpdating) return;

    try {
      setIsDeleting(true);
      await permanentlyDeleteUser(user._id);
      setOpen(false);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{user.firstName} {user.lastName}</DialogTitle>
          <DialogDescription>
            Review user profile and manage verification/deletion directly.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium break-all">{user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Joined</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <Badge variant="outline" className="mt-1">{user.role}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Verification</p>
            <Badge variant="secondary" className="mt-1">{user.verificationStatus}</Badge>
          </div>
          <div className="md:col-span-2">
            <p className="text-muted-foreground">Organization</p>
            <p className="font-medium">{user.organization?.name ?? "No organization assigned"}</p>
          </div>
          {user.specialty ? (
            <div>
              <p className="text-muted-foreground">Specialty</p>
              <p className="font-medium">{user.specialty}</p>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            variant="outline"
            disabled={isUpdating || isDeleting}
            onClick={() => updateVerificationStatus("VERIFIED")}
          >
            {isUpdating ? "Updating..." : "Mark Verified"}
          </Button>
          <Button
            variant="outline"
            disabled={isUpdating || isDeleting}
            onClick={() => updateVerificationStatus("PENDING")}
          >
            {isUpdating ? "Updating..." : "Mark Pending"}
          </Button>
          <Button
            variant="outline"
            disabled={isUpdating || isDeleting}
            onClick={() => updateVerificationStatus("REJECTED")}
          >
            {isUpdating ? "Updating..." : "Mark Rejected"}
          </Button>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          {user.role !== "SUPERADMIN" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isUpdating || isDeleting}>
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {user.firstName} {user.lastName} from Clerk and MongoDB.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete Permanently"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div />
          )}

          <Button variant="secondary" onClick={() => setOpen(false)} disabled={isUpdating || isDeleting}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
