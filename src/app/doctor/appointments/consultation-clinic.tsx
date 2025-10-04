// "use client";

// import { useState, useEffect } from 'react';
// import { format } from 'date-fns';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Loader2, Download } from 'lucide-react';
// import { getAppointmentDetails } from '@/actions/appointment-actions';
// import { PrescriptionForm } from '@/components/prescription-form';
// import jsPDF from 'jspdf';

// // Populated appointment ke liye type define karein
// type PopulatedAppointment = {
//   _id: string;
//   startTime: string;
//   status: string;
//   patient: { _id: string; firstName: string; lastName: string; dateOfBirth: string };
//   doctor: { firstName: string; lastName: string; specialty: string };
//   prescription?: {
//     _id: string;
//     chiefComplaint: string;
//     medicines: { name: string; dosage: string; timings: { morning: boolean; afternoon: boolean; night: boolean } }[];
//     tests: { name: string }[];
//     notes?: string;
//   };
// };

// export default function ConsultationClientPage({ initialAppointment }: { initialAppointment: PopulatedAppointment }) {
//   // The component now starts with the data passed from the server.
//   const [appointment, setAppointment] = useState<PopulatedAppointment>(initialAppointment);

//   const handleSaveSuccess = async () => {
//     // Re-fetch the latest data after the prescription is saved
//     const updatedData = await getAppointmentDetails(appointment._id);
//     if (updatedData) {
//       setAppointment(updatedData);
//     }
//   };

//   const handleDownloadPdf = () => {
//     if (!appointment?.prescription) return;

//     const doc = new jsPDF();
//     const { patient, doctor, prescription, startTime } = appointment;

//     // --- PDF Generation Logic (no changes needed) ---
//     doc.setFontSize(22);
//     doc.text("Clinic Prescription Report", 105, 20, { align: 'center' });
//     doc.setFontSize(12);
//     doc.text(`Date: ${format(new Date(startTime), "PPP")}`, 105, 28, { align: 'center' });
//     doc.line(15, 35, 195, 35);

//     let yPos = 45;
//     doc.setFontSize(14);
//     doc.text("Patient Information", 15, yPos);
//     doc.setFontSize(10);
//     doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 15, yPos + 8);
//     const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
//     doc.text(`Age: ${age} years`, 15, yPos + 13);

//     doc.setFontSize(14);
//     doc.text("Doctor Information", 105, yPos);
//     doc.setFontSize(10);
//     doc.text(`Name: Dr. ${doctor.firstName} ${doctor.lastName}`, 105, yPos + 8);
//     doc.text(`Specialty: ${doctor.specialty}`, 105, yPos + 13);
//     yPos += 25;
//     doc.line(15, yPos - 5, 195, yPos - 5);

//     doc.setFontSize(14);
//     doc.text("Chief Complaint / Diagnosis", 15, yPos + 5);
//     doc.setFontSize(10);
//     const complaintLines = doc.splitTextToSize(prescription.chiefComplaint, 180);
//     doc.text(complaintLines, 15, yPos + 12);
//     yPos += 15 + (complaintLines.length * 5);

//     if (prescription.medicines && prescription.medicines.length > 0) {
//         (doc as any).autoTable({
//             startY: yPos,
//             head: [['Medicine', 'Dosage', 'Timings (M-A-N)']],
//             body: prescription.medicines.map(med => [
//                 med.name,
//                 med.dosage,
//                 `${med.timings.morning ? '✔️' : '❌'} / ${med.timings.afternoon ? '✔️' : '❌'} / ${med.timings.night ? '✔️' : '❌'}`
//             ]),
//             theme: 'grid',
//             headStyles: { fillColor: [22, 160, 133] },
//         });
//         yPos = (doc as any).lastAutoTable.finalY + 10;
//     }

//     if (prescription.tests && prescription.tests.length > 0) {
//         (doc as any).autoTable({
//             startY: yPos,
//             head: [['Recommended Tests']],
//             body: prescription.tests.map(test => [test.name]),
//             theme: 'grid',
//             headStyles: { fillColor: [44, 62, 80] },
//         });
//         yPos = (doc as any).lastAutoTable.finalY + 10;
//     }

//     if (prescription.notes) {
//         doc.setFontSize(14);
//         doc.text("Additional Notes", 15, yPos);
//         doc.setFontSize(10);
//         const noteLines = doc.splitTextToSize(prescription.notes, 180);
//         doc.text(noteLines, 15, yPos + 7);
//     }

//     doc.save(`Prescription-${patient.firstName}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
//   };

//   return (
//     <div className="space-y-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Appointment Details</CardTitle>
//           <div className="flex flex-wrap gap-4 pt-2 text-sm">
//             <p><strong>Date:</strong> {format(new Date(appointment.startTime), "PPP")}</p>
//             <p><strong>Time:</strong> {format(new Date(appointment.startTime), "p")}</p>
//             <p><strong>Status:</strong> <Badge>{appointment.status}</Badge></p>
//           </div>
//         </CardHeader>
//       </Card>

//       {appointment.prescription ? (
//         <Card>
//             <CardHeader>
//                 <div className="flex justify-between items-center">
//                     <CardTitle>Prescription Issued</CardTitle>
//                     <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Download Report</Button>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <p>A prescription has been saved for this appointment.</p>
//             </CardContent>
//         </Card>
//       ) : (
//         <PrescriptionForm
//           appointmentId={appointment._id.toString()}
//           patientId={appointment.patient._id.toString()}
//           onSaveSuccess={handleSaveSuccess}
//         />
//       )}
//     </div>
//   );
// }


"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, Stethoscope, User, History } from 'lucide-react';
import { getAppointmentDetails } from '@/actions/appointment-actions';
import { PrescriptionForm } from '@/components/prescription-form';
import { PrintablePrescription } from './printable-prescription';
// Populated appointment ke liye type define karein
type PopulatedAppointment = {
  _id: string;
  startTime: string;
  status: string;
  patient: { _id: string; firstName: string; lastName: string; dateOfBirth: string };
  doctor: { firstName: string; lastName: string; specialty: string };
  prescription?: {
    _id: string;
    chiefComplaint: string;
    medicines: { name: string; dosage: string; timings: { morning: boolean; afternoon: boolean; night: boolean } }[];
    tests: { name: string }[];
    notes?: string;
  };
};

export default function ConsultationClientPage({ initialAppointment }: { initialAppointment: PopulatedAppointment }) {
  const [appointment, setAppointment] = useState<PopulatedAppointment>(initialAppointment);

  const handleSaveSuccess = async () => {
    // Prescription save hone ke baad, appointment details ko re-fetch karein
    const updatedData = await getAppointmentDetails(appointment._id);
    if (updatedData) {
      setAppointment(updatedData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Yeh component screen par nahi dikhega, yeh sirf printing ke liye hai */}
      <div className="print-only">
        {appointment.prescription && <PrintablePrescription appointment={appointment} />}
      </div>

      {/* Yeh main UI hai jo screen par dikhega */}
      <div className="space-y-6 print-hide">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Consultation</h1>
          <Badge>{appointment.status}</Badge>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Patient Details & History */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{appointment.patient.firstName} {appointment.patient.lastName}</CardTitle>
                  <CardDescription>
                    Age: {new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()} years
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Patient History</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Yahan aap patient ke purane appointments ki list dikha sakte hain */}
                <p className="text-sm text-muted-foreground">Previous appointment history will be shown here.</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {appointment.prescription ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" /> Prescription Issued
                    </CardTitle>
                    <Button onClick={handlePrint} variant="outline">
                      <Printer className="mr-2 h-4 w-4" /> Print Report
                    </Button>
                  </div>
                  <CardDescription>
                    Consultation on {format(new Date(appointment.startTime), "PPP, p")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold">Diagnosis</h4>
                      <p className="text-muted-foreground">{appointment.prescription.chiefComplaint}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <PrescriptionForm
                appointmentId={appointment._id.toString()}
                patientId={appointment.patient._id.toString()}
                onSaveSuccess={handleSaveSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

