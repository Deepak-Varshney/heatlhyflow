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

export function PrintablePrescription({ appointment }: { appointment: PopulatedAppointment }) {
  const { patient, doctor, prescription, startTime, treatments, doctorFee, discount, totalAmount } = appointment;
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
  
  // Use a smaller padding (p-4 instead of p-8) and smaller base font size (text-sm)
  return (
    <div className="p-4 font-sans bg-white text-gray-900 text-sm">
      
      {/* Header */}
      <div className="text-center mb-4">
        {/* Reduced font size from text-3xl to text-2xl */}
        <h1 className="text-2xl font-bold text-gray-800">Consultation Report</h1>
        {/* Reduced font size from text-gray-600 to text-sm */}
        <p className="text-sm text-gray-600">HealthyFlow Clinic</p>
        <p className="text-xs text-gray-500">Date: {format(new Date(startTime), "PPP")}</p>
      </div>

      <hr className="my-4 border-t border-gray-300" /> {/* Reduced margin and thinner line */}

      {/* Patient & Doctor Info */}
      {/* Reduced gap and margin-bottom */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          {/* Reduced font size from text-lg to text-base */}
          <h2 className="text-base font-semibold border-b pb-1 mb-2">Patient Details</h2>
          <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>Age:</strong> {age} years</p>
          <p><strong>Phone:</strong> {patient.phoneNumber}</p>
          <p><strong>Address:</strong> {patient.address}</p>
        </div>
        <div>
          {/* Reduced font size from text-lg to text-base */}
          <h2 className="text-base font-semibold border-b pb-1 mb-2">Consulting Doctor</h2>
          <p><strong>Name:</strong> Dr. {doctor.firstName} {doctor.lastName}</p>
          <p><strong>Specialty:</strong> {doctor.specialty}</p>
        </div>
      </div>

      {/* Vitals */}
      <div className="mb-4"> {/* Reduced margin-bottom */}
        {/* Reduced font size from text-lg to text-base */}
        <h2 className="text-base font-semibold border-b pb-1 mb-2">Patient Vitals</h2>
        {/* Reduced space-x */}
        <div className="flex space-x-6 text-sm">
          <p><strong>Blood Pressure:</strong> {patient.bp || 'N/A'}</p>
          <p><strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : 'N/A'}</p>
          <p><strong>Height:</strong> {patient.height ? `${patient.height} cm` : 'N/A'}</p>
        </div>
        {/* //as/ */}
      </div>

      {/* Complaint & Diagnosis */}
      {/* Reduced padding (p-3) and margin-bottom */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="mb-3"> {/* Reduced margin-bottom */}
          <h3 className="font-semibold text-gray-800 text-sm">Patient&rsquo;s Chief Complaint</h3>
          <p className="text-gray-700 text-sm">{prescription.chiefComplaint}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Doctor&rsquo;s Diagnosis</h3>
          <p className="text-gray-700 text-sm">{prescription.diagnosis}</p>
        </div>
      </div>

      {/* Medicines Table */}
      {prescription.medicines && prescription.medicines.length > 0 && (
        <div className="mb-4"> {/* Reduced margin-bottom */}
          {/* Reduced font size from text-lg to text-base */}
          <h2 className="text-base font-semibold border-b pb-1 mb-2">Medicines (Rx)</h2>
          <table className="w-full text-left border-collapse text-xs"> {/* Smaller table text */}
            <thead>
              <tr className="bg-gray-100">
                <th className="p-1 border">Medicine</th> {/* Reduced padding */}
                <th className="p-1 border">Dosage</th>
                <th className="p-1 border text-center">Morn</th> {/* Shortened column headers */}
                <th className="p-1 border text-center">Noon</th>
                <th className="p-1 border text-center">Night</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medicines.map((med, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-1 border">{med.name}</td> {/* Reduced padding */}
                  <td className="p-1 border">{med.dosage}</td>
                  <td className="p-1 border text-center">{med.timings.morning ? '✔️' : '—'}</td>
                  <td className="p-1 border text-center">{med.timings.afternoon ? '✔️' : '—'}</td>
                  <td className="p-1 border text-center">{med.timings.night ? '✔️' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tests */}
      {prescription.tests && prescription.tests.length > 0 && (
        <div className="mb-4"> {/* Reduced margin-bottom */}
          {/* Reduced font size from text-lg to text-base */}
          <h2 className="text-base font-semibold border-b pb-1 mb-2">X-Ray/Tests</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {prescription.tests.map((test, i) => (
              <li key={i}>
                {test.name}
                <p className='text-xs ml-4'>
                ({test.notes})
                </p>
                {test.reportImageUrl && <a href={test.reportImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 text-xs">[View Report]</a>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {prescription.notes && (
        <div className="mb-4">
          <h2 className="text-base font-semibold border-b pb-1 mb-2">Additional Notes</h2>
          <p className="text-gray-700 text-sm">{prescription.notes}</p>
        </div>
      )}

      {/* Price Breakdown */}
      {(appointment.treatments?.length || appointment.doctorFee || appointment.totalAmount || prescription.tests?.some(t => t.price && t.price > 0)) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h2 className="text-base font-semibold border-b pb-1 mb-3">Price Breakdown</h2>
          <div className="space-y-2 text-sm">
            {appointment.doctorFee && appointment.doctorFee > 0 && (
              <div className="flex justify-between">
                <span>Doctor Consultation Fee:</span>
                <span className="font-medium">₹{appointment.doctorFee.toFixed(2)}</span>
              </div>
            )}
            {appointment.treatments && appointment.treatments.length > 0 && (
              <>
                {appointment.treatments.map((treatment, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{treatment.name}:</span>
                    <span className="font-medium">₹{treatment.price.toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}
            {prescription.tests && prescription.tests.some(t => t.price && t.price > 0) && (
              <>
                {prescription.tests.filter(t => t.price && t.price > 0).map((test, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{test.name} (Test):</span>
                    <span className="font-medium">₹{(test.price || 0).toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}
            {appointment.discount && appointment.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span className="font-medium">-₹{appointment.discount.toFixed(2)}</span>
              </div>
            )}
            {appointment.totalAmount !== undefined && (
              <div className="flex justify-between pt-2 border-t border-gray-300 font-semibold text-base">
                <span>Total Amount:</span>
                <span>₹{Math.max(0, appointment.totalAmount).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Signature/Footer Placeholder */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-right text-xs">
          <p>Digital Signature / Stamp</p>
          <p>Dr. {doctor.firstName} {doctor.lastName}</p>
      </div>
      
    </div>
  );
}