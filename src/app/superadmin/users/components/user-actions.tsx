"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserCheck, UserX, Trash2, MoreHorizontal } from "lucide-react";
import { bulkUpdateUsers, deleteUser } from "@/actions/superadmin-actions";
import { DevilAlert } from "./devil-alert";

interface UserActionsProps {
  user: any;
  currentUserRole?: string;
}

export function UserActions({ user, currentUserRole }: UserActionsProps) {
  const [devilAlertOpen, setDevilAlertOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: string, targetUser: any } | null>(null);

  const checkDevilPermission = (action: string) => {
    // If target user is SUPERADMIN and current user is not DEVIL, show devil alert
    if (user.role === "SUPERADMIN" && currentUserRole !== "DEVIL") {
      setPendingAction({ action, targetUser: user });
      setDevilAlertOpen(true);
      return false;
    }
    return true;
  };

  const handleBulkAction = async (action: string) => {
    if (!checkDevilPermission(action)) return;

    if (action === "verify") {
      await bulkUpdateUsers([user._id], { verificationStatus: "VERIFIED" });
    } else if (action === "reject") {
      await bulkUpdateUsers([user._id], { verificationStatus: "REJECTED" });
    }
  };

  const handleDelete = async () => {
    if (!checkDevilPermission("delete")) return;
    await deleteUser(user._id);
  };

  return (
    <>
      {/* Devil Alert Dialog */}
      {pendingAction && (
        <DevilAlert
          isOpen={devilAlertOpen}
          onClose={() => {
            setDevilAlertOpen(false);
            setPendingAction(null);
          }}
          targetUser={pendingAction.targetUser}
          action={pendingAction.action}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleBulkAction("verify")}>
            <UserCheck className="h-4 w-4 mr-2" />
            Verify User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkAction("reject")}>
            <UserX className="h-4 w-4 mr-2" />
            Reject User
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {user.firstName} {user.lastName}?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>

  );
}
