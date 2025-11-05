'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { getClinicSettings } from '@/actions/treatment-actions';

type PopulatedAppointment = {
  startTime: string;
  patient: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    address: string;
    bp?: string;
    weight?: number;
    height?: number;
  };
  doctor: {
    firstName: string;
    lastName: string;
    specialty: string;
  };
  prescription: {
    chiefComplaint: string;
    diagnosis: string;
    medicines: { name: string; dosage: string; timings: { morning: boolean; afternoon: boolean; night: boolean } }[];
    tests: { name: string; reportImageUrl?: string; notes: string; price?: number }[];
    notes?: string;
  };
  treatments?: Array<{
    treatment: string;
    name: string;
    price: number;
  }>;
  doctorFee?: number;
  discount?: number;
  totalAmount?: number;
};

export function PrintableConsultationForm({ appointment }: { appointment: PopulatedAppointment }) {
  const { patient, doctor, prescription, startTime } = appointment;
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
  
  const [clinicSettings, setClinicSettings] = useState<{
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    watermarkImageUrl: string;
  } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await getClinicSettings();
      if (result.success) {
        setClinicSettings({
          clinicName: result.clinicName || 'Clinic Name',
          clinicAddress: result.clinicAddress || 'Clinic Address',
          clinicPhone: result.clinicPhone || 'Clinic Phone',
          watermarkImageUrl: result.watermarkImageUrl || '',
        });
      } else {
        // Fallback to default values
        setClinicSettings({
          clinicName: 'Clinic Name',
          clinicAddress: 'Clinic Address',
          clinicPhone: 'Clinic Phone',
          watermarkImageUrl: '',
        });
      }
    };
    fetchSettings();
  }, []);

  if (!clinicSettings) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="relative p-8 font-sans bg-white text-gray-900 min-h-screen">
      {/* Watermark Background */}
      {clinicSettings.watermarkImageUrl && (
        <div 
          className="fixed inset-0 pointer-events-none opacity-10 z-0"
          style={{
            backgroundImage: `url(${clinicSettings.watermarkImageUrl})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Clinic Info */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {clinicSettings.clinicName}
          </h1>
          <p className="text-sm text-gray-600 mb-1">
            {clinicSettings.clinicAddress}
          </p>
          <p className="text-sm text-gray-600">
            Phone: {clinicSettings.clinicPhone}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Consultation Date: {format(new Date(startTime), "PPP")}
          </p>
        </div>

        {/* Patient & Doctor Info */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">Patient Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
              <p><strong>Age:</strong> {age} years</p>
              <p><strong>Date of Birth:</strong> {format(new Date(patient.dateOfBirth), "PPP")}</p>
              <p><strong>Phone:</strong> {patient.phoneNumber}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Address:</strong> {patient.address}</p>
            </div>
          </div>
          <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">Consulting Doctor</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> Dr. {doctor.firstName} {doctor.lastName}</p>
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="mb-6 border p-4 rounded-lg">
          <h2 className="text-lg font-semibold border-b pb-2 mb-3">Patient Vitals</h2>
          <div className="flex space-x-8 text-sm">
            <p><strong>Blood Pressure:</strong> {patient.bp || 'N/A'}</p>
            <p><strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : 'N/A'}</p>
            <p><strong>Height:</strong> {patient.height ? `${patient.height} cm` : 'N/A'}</p>
          </div>
        </div>

        {/* Complaint & Diagnosis */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Patient&rsquo;s Chief Complaint</h3>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{prescription.chiefComplaint}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Doctor&rsquo;s Diagnosis</h3>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{prescription.diagnosis}</p>
          </div>
        </div>

        {/* Medicines Table */}
        {prescription.medicines && prescription.medicines.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">Medicines (Rx)</h2>
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">Medicine</th>
                  <th className="p-2 border border-gray-300">Dosage</th>
                  <th className="p-2 border border-gray-300 text-center">Morning</th>
                  <th className="p-2 border border-gray-300 text-center">Afternoon</th>
                  <th className="p-2 border border-gray-300 text-center">Night</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((med, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-300">{med.name}</td>
                    <td className="p-2 border border-gray-300">{med.dosage}</td>
                    <td className="p-2 border border-gray-300 text-center">{med.timings.morning ? '✔️' : '—'}</td>
                    <td className="p-2 border border-gray-300 text-center">{med.timings.afternoon ? '✔️' : '—'}</td>
                    <td className="p-2 border border-gray-300 text-center">{med.timings.night ? '✔️' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tests */}
        {prescription.tests && prescription.tests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">X-Ray/Tests</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {prescription.tests.map((test, i) => (
                <li key={i} className="mb-2">
                  <strong>{test.name}</strong>
                  {test.notes && (
                    <p className="text-xs ml-4 text-gray-600">
                      ({test.notes})
                    </p>
                  )}
                  {test.reportImageUrl && (
                    <a 
                      href={test.reportImageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 ml-2 text-xs underline"
                    >
                      [View Report]
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {prescription.notes && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">Additional Notes</h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{prescription.notes}</p>
          </div>
        )}

        {/* Signature/Footer */}
        <div className="mt-12 pt-4 border-t-2 border-gray-300">
          <div className="flex justify-between items-end">
            <div className="text-xs text-gray-500">
              <p>Generated on: {format(new Date(), "PPP 'at' p")}</p>
            </div>
            <div className="text-right">
              <div className="mb-8 h-16 border-b-2 border-gray-800 w-48"></div>
              <p className="text-sm font-semibold">Dr. {doctor.firstName} {doctor.lastName}</p>
              <p className="text-xs text-gray-600">{doctor.specialty}</p>
              <p className="text-xs text-gray-500 mt-2">Digital Signature / Stamp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

