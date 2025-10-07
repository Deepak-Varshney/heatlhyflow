"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { UserEditForm } from "./user-edit-form";
import { UserActions } from "./user-actions";

interface UserCardProps {
  user: any;
  currentUserRole?: string;
}

export function UserCard({ user, currentUserRole }: UserCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "DEVIL": return "bg-gradient-to-r from-red-900 to-black text-red-400 font-bold border-2 border-red-600";
      case "SUPERADMIN": return "bg-purple-100 text-purple-800";
      case "DOCTOR": return "bg-blue-100 text-blue-800";
      case "RECEPTIONIST": return "bg-green-100 text-green-800";
      case "UNASSIGNED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <Badge className={getStatusColor(user.verificationStatus)}>
                {user.verificationStatus}
              </Badge>
              <Badge className={getRoleColor(user.role)}>
                {user.role}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">{user.email}</p>

            {user.specialty && (
              <p className="text-sm text-muted-foreground mb-2">
                Specialty: {user.specialty}
              </p>
            )}

            {user.organization && (
              <p className="text-sm text-muted-foreground mb-2">
                Organization: {user.organization.name}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <UserEditForm user={user} onClose={() => window.location.reload()} currentUserRole={currentUserRole} />
              </DialogContent>
            </Dialog>

            <UserActions user={user} currentUserRole={currentUserRole} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
