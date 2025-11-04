// "use client";

// import { useState } from "react";
// import { format } from "date-fns";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Loader2,
//   Printer,
//   Stethoscope,
//   User,
//   History,
//   Calendar,
//   Clock,
//   HeartPulse,
//   Weight,
//   Phone,
//   Mail,
//   AlertTriangle,
// } from "lucide-react";
// import { getAppointmentDetails } from "@/actions/appointment-actions";
// import { PrescriptionForm } from "@/components/prescription-form";
// import { PrintablePrescription } from "./printable-prescription";

// // Populated appointment type
// type PopulatedAppointment = {
//   _id: string;
//   startTime: string;
//   endTime: string;
//   status: string;
//   patient: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     dateOfBirth: string;
//     email: string;
//     phoneNumber: string;
//     address: string;
//     bp: string;
//     weight: string;
//     occupation: string;
//     emergencyContact: { name: string; phone: string };
//   };
//   doctor: {
//     firstName: string;
//     lastName: string;
//     specialty: string;
//   };
//   prescription?: {
//     _id: string;
//     chiefComplaint: string;
//     medicines: {
//       name: string;
//       dosage: string;
//       timings: {
//         morning: boolean;
//         afternoon: boolean;
//         night: boolean;
//       };
//     }[];
//     tests: { name: string }[];
//     notes?: string;
//   };
// };

// export default function ConsultationClientPage({
//   initialAppointment,
// }: {
//   initialAppointment: PopulatedAppointment;
// }) {
//   const [appointment, setAppointment] =
//     useState<PopulatedAppointment>(initialAppointment);

//   const now = new Date();
//   const start = new Date(appointment.startTime);
//   const end = new Date(appointment.endTime);

//   const isInConsultationWindow = now >= start && now <= end;

//   const handleSaveSuccess = async () => {
//     const updatedData = await getAppointmentDetails(appointment._id);
//     if (updatedData) {
//       setAppointment(updatedData);
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const calculateAge = (dob: string) => {
//     const birthDate = new Date(dob);
//     const ageDiff = Date.now() - birthDate.getTime();
//     const age = new Date(ageDiff);
//     return Math.abs(age.getUTCFullYear() - 1970);
//   };

//   return (
//     <>
//       {/* Hidden print version */}
//       <div className="print-only">
//         {appointment.prescription && (
//           <PrintablePrescription appointment={appointment} />
//         )}
//       </div>

//       {/* Main UI */}
//       <div className="space-y-6 print-hide">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold">Consultation</h1>
//           <Badge>{appointment.status.toUpperCase()}</Badge>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <User className="h-5 w-5 text-primary" />
//                   Patient Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2 text-sm">
//                 <p>
//                   <strong>Name:</strong> {appointment.patient.firstName}{" "}
//                   {appointment.patient.lastName}
//                 </p>
//                 <p>
//                   <strong>Age:</strong> {calculateAge(appointment.patient.dateOfBirth)}{" "}
//                   years
//                 </p>
//                 <p>
//                   <strong>Weight:</strong> {appointment.patient.weight}
//                 </p>
//                 <p>
//                   <strong>Blood Pressure:</strong> {appointment.patient.bp}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {appointment.patient.email}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {appointment.patient.phoneNumber}
//                 </p>
//                 <p>
//                   <strong>Address:</strong> {appointment.patient.address}
//                 </p>
//                 <p>
//                   <strong>Emergency Contact:</strong>{" "}
//                   {appointment.patient.emergencyContact.name} (
//                   {appointment.patient.emergencyContact.phone})
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4" /> Appointment Info
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2 text-sm">
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {format(new Date(appointment.startTime), "PPP")}
//                 </p>
//                 <p>
//                   <strong>Time Slot:</strong>{" "}
//                   {format(start, "p")} - {format(end, "p")}
//                 </p>
//                 <p>
//                   <strong>Doctor:</strong>{" "}
//                   {appointment.doctor.firstName} {appointment.doctor.lastName} (
//                   {appointment.doctor.specialty})
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <History className="h-5 w-5" /> Patient History
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground">
//                   Previous appointment history will be shown here.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="lg:col-span-2">
//             {appointment.prescription ? (
//               <Card>
//                 <CardHeader>
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="flex items-center gap-2">
//                       <Stethoscope className="h-5 w-5" /> Prescription Issued
//                     </CardTitle>
//                     <Button onClick={handlePrint} variant="outline">
//                       <Printer className="mr-2 h-4 w-4" /> Print Report
//                     </Button>
//                   </div>
//                   <CardDescription>
//                     Consultation on {format(new Date(appointment.startTime), "PPP, p")}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4 text-sm">
//                     <div>
//                       <h4 className="font-semibold">Diagnosis</h4>
//                       <p className="text-muted-foreground">
//                         {appointment.prescription.chiefComplaint}
//                       </p>
//                     </div>
//                     {/* Add other prescription fields if needed */}
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : isInConsultationWindow ? (
//               <PrescriptionForm
//                 appointmentId={appointment._id.toString()}
//                 patientId={appointment.patient._id.toString()}
//                 onSaveSuccess={handleSaveSuccess}
//               />
//             ) : (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-red-500">
//                     <AlertTriangle className="h-5 w-5" />
//                     Prescription Not Available
//                   </CardTitle>
//                   <CardDescription>
//                     You can only add a prescription during the scheduled consultation
//                     time ({format(start, "p")} - {format(end, "p")}).
//                   </CardDescription>
//                 </CardHeader>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, Stethoscope, User, History, HeartPulse, Weight } from 'lucide-react';
import { getAppointmentDetails } from '@/actions/appointment-actions';
import { PrescriptionForm } from '@/components/prescription-form';
import { PrintPreviewDialog } from './print-preview-dialog'; // Naya Print Preview Dialog
import { getPatientById } from '@/actions/patient-actions';

// Populated appointment ke liye naya type
type PopulatedAppointment = {
  _id: string;
  startTime: string;
  endTime: string;
  status: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    bp?: string;
    weight?: number;
    phoneNumber?: string;
    email?: string;
    address?: string;
    emergencyContact?: {
      name?: string;
      phone?: string;
    }
  };
  doctor: { firstName: string; lastName: string; specialty: string };
  prescription?: any;
  treatments?: Array<{
    treatment: string;
    name: string;
    price: number;
  }>;
  doctorFee?: number;
  discount?: number;
  totalAmount?: number;
};

export default function ConsultationClientPage({ initialAppointment }: { initialAppointment: PopulatedAppointment }) {
  const [appointment, setAppointment] = useState<PopulatedAppointment>(initialAppointment);
  const [patientHistory, setPatientHistory] = useState([]); // NAYI STATE: History ke liye

  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printType, setPrintType] = useState<'consultation' | 'bill' | 'prescription'>('consultation');
  const now = new Date();
  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);
  const isWithinSlot = now >= startTime && now <= endTime;
  const handleSaveSuccess = async () => {
    const updatedData = await getAppointmentDetails(appointment._id);
    if (updatedData) setAppointment(updatedData);
  };

  const calculateAge = (dob: string) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };
  useEffect(() => {
    const fetchPatientHistory = async () => {
      if (appointment.patient) {
        const patientData = await getPatientById(appointment.patient._id);
        if (patientData) {
          // Current appointment ko chhod kar baaki sab history hai
          setPatientHistory(patientData.appointments.filter((appt: any) => appt._id !== appointment._id));
        }
      }
    };
    fetchPatientHistory();
  }, [appointment.patient, appointment._id]);


  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Consultation</h1>
          <Badge>{appointment.status.toUpperCase()}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Patient Chart */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Patient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Name:</strong> {appointment.patient.firstName} {appointment.patient.lastName}</p>
                <p><strong>Age:</strong> {calculateAge(appointment.patient.dateOfBirth)} years</p>
                <div className="flex items-center gap-2 pt-2">
                  <HeartPulse className="h-5 w-5 text-red-500" />
                  <p><strong>BP:</strong> {appointment.patient.bp || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-blue-500" />
                  <p><strong>Weight:</strong> {appointment.patient.weight ? `${appointment.patient.weight} kg` : 'N/A'}</p>
                </div>
                <p><strong>Email:</strong> {appointment.patient.email}</p>
                <p><strong>Phone:</strong> {appointment.patient.phoneNumber}</p>
                <p><strong>Address:</strong> {appointment.patient.address}</p>
                <p>
                  <strong>Emergency Contact:</strong> {appointment.patient.emergencyContact?.name} ({appointment.patient.emergencyContact?.phone})
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Patient History</CardTitle>
              </CardHeader>
              <CardContent>
                {patientHistory.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                    {patientHistory.map((appt: any) => (
                      <li key={appt._id} className="border-b pb-2">
                        <p><strong>{format(new Date(appt.startTime), 'PPP')}</strong> - <Badge variant="secondary">{appt.status}</Badge></p>
                        <p className="text-xs text-muted-foreground">Dr. {appt.doctor.lastName} ({appt.prescription?.diagnosis || 'No diagnosis'})</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No previous appointment history found.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Prescription */}
          <div className="lg:col-span-2">
            {appointment.prescription ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" /> Consultation Report
                  </CardTitle>
                  <CardDescription>
                    Consultation on {format(new Date(appointment.startTime), "PPP, p")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">The prescription has been issued for this consultation.</p>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => { setPrintType('consultation'); setShowPrintPreview(true); }}>
                      <Printer className="mr-2 h-4 w-4" /> Print Consultation
                    </Button>
                    <Button variant="outline" onClick={() => { setPrintType('bill'); setShowPrintPreview(true); }}>
                      <Printer className="mr-2 h-4 w-4" /> Print Bill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : true ? (
              <PrescriptionForm
                appointmentId={appointment._id.toString()}
                patientId={appointment.patient._id.toString()}
                onSaveSuccess={handleSaveSuccess}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" /> Prescription Unavailable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    You can only add a prescription during the consultation time slot ({format(startTime, "PPP, p")} - {format(endTime, "p")}).
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Print Preview Dialog */}
      {appointment.prescription && (
        <PrintPreviewDialog
          isOpen={showPrintPreview}
          onClose={() => setShowPrintPreview(false)}
          appointment={appointment}
          initialPrintType={printType}
        />
      )}
    </>
  );
}

