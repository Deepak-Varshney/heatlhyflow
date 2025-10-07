"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skull, Zap, Flame } from "lucide-react";

interface DevilAlertProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    firstName: string;
    lastName: string;
    role: string;
  };
  action: string;
}

export function DevilAlert({ isOpen, onClose, targetUser, action }: DevilAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gradient-to-br from-red-900 to-black border-red-600 text-white max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Skull className="h-8 w-8 text-red-500 animate-pulse" />
            <AlertDialogTitle className="text-red-400 text-xl font-bold">
              ⚠️ DANGER ZONE ⚠️
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-red-200 space-y-3">
            <div className="bg-red-950/50 p-3 rounded-lg border border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-red-300">SUPERADMIN PROTECTION ACTIVE</span>
              </div>
              <p className="text-sm">
                You are attempting to <span className="font-bold text-red-400">{action}</span> a 
                <span className="font-bold text-yellow-400"> SUPERADMIN</span> user:
              </p>
              <div className="bg-black/30 p-2 rounded mt-2 border border-red-700">
                <p className="font-mono text-red-300">
                  👤 {targetUser.firstName} {targetUser.lastName}
                </p>
                <p className="text-xs text-red-400">Role: {targetUser.role}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-900 to-black p-3 rounded-lg border border-red-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-yellow-400">DEVIL AUTHORIZATION REQUIRED</span>
              </div>
              <p className="text-sm text-red-200">
                Only the <span className="font-bold text-red-400">DEVIL</span> role can perform actions on SUPERADMIN users.
                This action requires the highest level of authorization in the system.
              </p>
            </div>

            <div className="text-center p-2 bg-red-950 rounded border border-red-800">
              <p className="text-xs text-red-300 font-mono">
                🔥 SYSTEM INTEGRITY PROTECTION 🔥
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onClose}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-red-500 font-bold"
          >
            🚫 UNDERSTOOD
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
