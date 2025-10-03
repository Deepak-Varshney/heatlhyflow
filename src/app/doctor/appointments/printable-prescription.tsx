'use client';

import { format } from 'date-fns';

// Yeh woh type hai jo hum ConsultationClientPage se receive karenge
type PopulatedAppointment = {
  startTime: string;
  patient: { firstName: string; lastName: string; dateOfBirth: string };
  doctor: { firstName: string; lastName: string; specialty: string };
  prescription: {
    chiefComplaint: string;
    medicines: { name: string; dosage: string; timings: { morning: boolean; afternoon: boolean; night: boolean } }[];
    tests: { name: string }[];
    notes?: string;
  };
};

export function PrintablePrescription({ appointment }: { appointment: PopulatedAppointment|any }) {
  const { patient, doctor, prescription, startTime } = appointment;
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Prescription Report</h1>
        <p className="text-gray-600">HealthyFlow Clinic</p>
        <p className="text-sm text-gray-500">Date: {format(new Date(startTime), "PPP")}</p>
      </div>

      <hr className="my-6" />

      {/* Patient & Doctor Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Patient Information</h2>
          <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>Age:</strong> {age} years</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Doctor Information</h2>
          <p><strong>Name:</strong> Dr. {doctor.firstName} {doctor.lastName}</p>
          <p><strong>Specialty:</strong> {doctor.specialty}</p>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Diagnosis / Chief Complaint</h2>
        <p className="text-gray-700">{prescription.chiefComplaint}</p>
      </div>

      {/* Medicines Table */}
      {prescription.medicines && prescription.medicines.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Medicines (Rx)</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Medicine</th>
                <th className="p-2 border">Dosage</th>
                <th className="p-2 border text-center">Morning</th>
                <th className="p-2 border text-center">Afternoon</th>
                <th className="p-2 border text-center">Night</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medicines.map((med:any, i:any) => (
                <tr key={i}>
                  <td className="p-2 border">{med.name}</td>
                  <td className="p-2 border">{med.dosage}</td>
                  <td className="p-2 border text-center">{med.timings.morning ? '✔️' : ''}</td>
                  <td className="p-2 border text-center">{med.timings.afternoon ? '✔️' : ''}</td>
                  <td className="p-2 border text-center">{med.timings.night ? '✔️' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tests */}
      {prescription.tests && prescription.tests.length > 0 && (
         <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Recommended Tests</h2>
            <ul className="list-disc list-inside">
                {prescription.tests.map((test:any, i:any) => <li key={i}>{test.name}</li>)}
            </ul>
        </div>
      )}

      {/* Notes */}
      {prescription.notes && (
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Additional Notes</h2>
          <p className="text-gray-700">{prescription.notes}</p>
        </div>
      )}
    </div>
  );
}

