"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Trash2 } from "lucide-react";

interface UserStatsProps {
  stats: {
    totalUsers: number;
    verifiedUsers: number;
    pendingUsers: number;
    rejectedUsers: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Verified</p>
              <p className="text-2xl font-bold">{stats.verifiedUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold">{stats.pendingUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold">{stats.rejectedUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
