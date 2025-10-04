// 'use client';

// import { format } from 'date-fns';

// // Yeh woh type hai jo hum ConsultationClientPage se receive karenge
// type PopulatedAppointment = {
//   startTime: string;
//   patient: { firstName: string; lastName: string; dateOfBirth: string };
//   doctor: { firstName: string; lastName: string; specialty: string };
//   prescription: {
//     chiefComplaint: string;
//     medicines: { name: string; dosage: string; timings: { morning: boolean; afternoon: boolean; night: boolean } }[];
//     tests: { name: string }[];
//     notes?: string;
//   };
// };

// export function PrintablePrescription({ appointment }: { appointment: PopulatedAppointment|any }) {
//   const { patient, doctor, prescription, startTime } = appointment;
//   const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

//   return (
//     <div className="p-8 font-sans">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold">Prescription Report</h1>
//         <p className="text-gray-600">HealthyFlow Clinic</p>
//         <p className="text-sm text-gray-500">Date: {format(new Date(startTime), "PPP")}</p>
//       </div>

//       <hr className="my-6" />

//       {/* Patient & Doctor Info */}
//       <div className="grid grid-cols-2 gap-8 mb-6">
//         <div>
//           <h2 className="text-lg font-semibold border-b pb-1 mb-2">Patient Information</h2>
//           <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
//           <p><strong>Age:</strong> {age} years</p>
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold border-b pb-1 mb-2">Doctor Information</h2>
//           <p><strong>Name:</strong> Dr. {doctor.firstName} {doctor.lastName}</p>
//           <p><strong>Specialty:</strong> {doctor.specialty}</p>
//         </div>
//       </div>

//       {/* Diagnosis */}
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold border-b pb-1 mb-2">Diagnosis / Chief Complaint</h2>
//         <p className="text-gray-700">{prescription.chiefComplaint}</p>
//       </div>

//       {/* Medicines Table */}
//       {prescription.medicines && prescription.medicines.length > 0 && (
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold border-b pb-1 mb-2">Medicines (Rx)</h2>
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-2 border">Medicine</th>
//                 <th className="p-2 border">Dosage</th>
//                 <th className="p-2 border text-center">Morning</th>
//                 <th className="p-2 border text-center">Afternoon</th>
//                 <th className="p-2 border text-center">Night</th>
//               </tr>
//             </thead>
//             <tbody>
//               {prescription.medicines.map((med:any, i:any) => (
//                 <tr key={i}>
//                   <td className="p-2 border">{med.name}</td>
//                   <td className="p-2 border">{med.dosage}</td>
//                   <td className="p-2 border text-center">{med.timings.morning ? '✔️' : ''}</td>
//                   <td className="p-2 border text-center">{med.timings.afternoon ? '✔️' : ''}</td>
//                   <td className="p-2 border text-center">{med.timings.night ? '✔️' : ''}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Tests */}
//       {prescription.tests && prescription.tests.length > 0 && (
//          <div className="mb-6">
//             <h2 className="text-lg font-semibold border-b pb-1 mb-2">Recommended Tests</h2>
//             <ul className="list-disc list-inside">
//                 {prescription.tests.map((test:any, i:any) => <li key={i}>{test.name}</li>)}
//             </ul>
//         </div>
//       )}

//       {/* Notes */}
//       {prescription.notes && (
//         <div>
//           <h2 className="text-lg font-semibold border-b pb-1 mb-2">Additional Notes</h2>
//           <p className="text-gray-700">{prescription.notes}</p>
//         </div>
//       )}
//     </div>
//   );
// }



'use client';

import { format } from 'date-fns';

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
    tests: { name: string; reportUrl?: string }[];
    notes?: string;
  };
};

export function PrintablePrescription({ appointment }: { appointment: PopulatedAppointment }) {
  const { patient, doctor, prescription, startTime } = appointment;
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="p-8 font-sans bg-white text-gray-900">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Consultation Report</h1>
        <p className="text-gray-600">HealthyFlow Clinic</p>
        <p className="text-sm text-gray-500">Date: {format(new Date(startTime), "PPP")}</p>
      </div>

      <hr className="my-6 border-t-2 border-gray-200" />

      {/* Patient & Doctor Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Patient Details</h2>
          <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>Age:</strong> {age} years</p>
          <p><strong>Phone:</strong> {patient.phoneNumber}</p>
          <p><strong>Address:</strong> {patient.address}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Consulting Doctor</h2>
          <p><strong>Name:</strong> Dr. {doctor.firstName} {doctor.lastName}</p>
          <p><strong>Specialty:</strong> {doctor.specialty}</p>
        </div>
      </div>

      {/* Vitals */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Patient Vitals</h2>
        <div className="flex space-x-8">
          <p><strong>Blood Pressure:</strong> {patient.bp || 'N/A'}</p>
          <p><strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : 'N/A'}</p>
          <p><strong>Height:</strong> {patient.height ? `${patient.height} cm` : 'N/A'}</p>
        </div>
      </div>

      {/* Complaint & Diagnosis */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">Patient&rsquo;s Chief Complaint</h3>
          <p className="text-gray-700">{prescription.chiefComplaint}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Doctor&rsquo;s Diagnosis</h3>
          <p className="text-gray-700">{prescription.diagnosis}</p>
        </div>
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
              {prescription.medicines.map((med, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">{med.name}</td>
                  <td className="p-2 border">{med.dosage}</td>
                  <td className="p-2 border text-center">{med.timings.morning ? '✔️' : '—'}</td>
                  <td className="p-2 border text-center">{med.timings.afternoon ? '✔️' : '—'}</td>
                  <td className="p-2 border text-center">{med.timings.night ? '✔️' : '—'}</td>
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
          <ul className="list-disc list-inside space-y-1">
            {prescription.tests.map((test, i) => (
              <li key={i}>
                {test.name}
                {test.reportUrl && <a href={test.reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 text-xs">[View Report]</a>}
              </li>
            ))}
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