"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Cake, Mail, Phone, HeartPulse, Weight, Home, ShieldAlert, Edit } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { EditPatientDialog } from "./edit-patient-dialog";

// Patient aur uske populated appointments ke liye type
type PatientWithAppointments = {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: string;
  bp?: string;
  weight?: number;
  emergencyContact: { name: string; phone: string; };
  appointments: {
    _id: string;
    startTime: string;
    status: string;
    doctor: {
      firstName: string;
      lastName: string;
    };
  }[];
};

const calculateAge = (dob: string) => {
  return new Date().getFullYear() - new Date(dob).getFullYear();
};

export default function PatientDetailsClientPage({ patient }: { patient: PatientWithAppointments }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Profile</h1>
        <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Patient
        </Button>
        <EditPatientDialog
          patient={patient}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6" />
                <span>{patient.firstName} {patient.lastName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3"><Cake className="h-4 w-4 text-muted-foreground" /> <span>{calculateAge(patient.dateOfBirth)} years old ({format(new Date(patient.dateOfBirth), 'PPP')})</span></div>
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{patient.email}</span></div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{patient.phoneNumber}</span></div>
              <div className="flex items-center gap-3"><Home className="h-4 w-4 text-muted-foreground" /> <span>{patient.address}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><HeartPulse className="h-5 w-5" /> Vitals</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3"><p><strong>Blood Pressure:</strong> {patient.bp || 'N/A'}</p></div>
              <div className="flex items-center gap-3"><p><strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : 'N/A'}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><ShieldAlert className="h-5 w-5" /> Emergency Contact</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Name:</strong> {patient.emergencyContact.name}</p>
              <p><strong>Phone:</strong> {patient.emergencyContact.phone}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Appointment History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Appointment History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.appointments.length > 0 ? (
                    patient.appointments.map(appt => (
                      <TableRow key={appt._id}>
                        <TableCell>{format(new Date(appt.startTime), 'PPP p')}</TableCell>
                        <TableCell>Dr. {appt.doctor.firstName} {appt.doctor.lastName}</TableCell>
                        <TableCell><Badge>{appt.status}</Badge></TableCell>
                        <TableCell>
                          <Link href={`/doctor/appointments/${appt._id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No appointment history found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
