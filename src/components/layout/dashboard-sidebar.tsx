// components/layout/DashboardSidebar.tsx
'use client'

import Link from "next/link";
import { useOrganization, useUser } from "@clerk/nextjs";

export default function DashboardSidebar() {
  const { user } = useUser();
  const { membership } = useOrganization();

  // Check if the user is an admin of the current organization
  const isAdmin = membership?.role === 'org:admin';
  
  return (
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Clinic Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li><Link href="/dashboard">Overview</Link></li>
            <li><Link href="/dashboard/patients">Patients</Link></li>
            <li><Link href="/dashboard/appointments">Appointments</Link></li>
            
            {/* Conditionally render the Admin link */}
            {isAdmin && (
                <li><Link href="/dashboard/admin" className="font-bold text-primary">Manage Clinic</Link></li>
            )}
          </ul>
        </nav>
      </aside>
  )
}