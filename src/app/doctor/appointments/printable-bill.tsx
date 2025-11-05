'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { getClinicSettings } from '@/actions/treatment-actions';

type PopulatedAppointment = {
  _id: string;
  startTime: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  doctor: {
    firstName: string;
    lastName: string;
    specialty: string;
  };
  prescription?: {
    tests: { name: string; price?: number }[];
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

export function PrintableBill({ appointment }: { appointment: PopulatedAppointment }) {
  const { patient, doctor, startTime, treatments, doctorFee, discount, totalAmount, prescription } = appointment;
  
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

  // Calculate totals
  const testsTotal = prescription?.tests?.reduce((sum, test) => sum + (test.price || 0), 0) || 0;
  const treatmentsTotal = treatments?.reduce((sum, t) => sum + (t.price || 0), 0) || 0;
  const subtotal = (doctorFee || 0) + treatmentsTotal + testsTotal;
  const finalTotal = Math.max(0, (totalAmount || subtotal) - (discount || 0));

  return (
    <div className="relative p-8 font-sans bg-white text-gray-900">
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
          <p className="text-sm text-gray-600 mb-4">
            Phone: {clinicSettings.clinicPhone}
          </p>
          <h2 className="text-2xl font-bold text-gray-800">BILL / INVOICE</h2>
          <p className="text-xs text-gray-500 mt-2">
            Date: {format(new Date(startTime), "PPP")}
          </p>
        </div>

        {/* Patient & Bill Info */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">Bill To</h2>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
              <p><strong>Phone:</strong> {patient.phoneNumber}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Address:</strong> {patient.address}</p>
            </div>
          </div>
          <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">Bill Details</h2>
            <div className="space-y-1 text-sm">
              <p><strong>Bill No:</strong> {appointment._id.slice(-8).toUpperCase()}</p>
              <p><strong>Date:</strong> {format(new Date(startTime), "PPP")}</p>
              <p><strong>Doctor:</strong> Dr. {doctor.firstName} {doctor.lastName}</p>
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-3">Bill Items</h2>
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-300">S.No.</th>
                <th className="p-3 border border-gray-300">Description</th>
                <th className="p-3 border border-gray-300 text-right">Quantity</th>
                <th className="p-3 border border-gray-300 text-right">Price (₹)</th>
                <th className="p-3 border border-gray-300 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {doctorFee && doctorFee > 0 && (
                <tr>
                  <td className="p-3 border border-gray-300">1</td>
                  <td className="p-3 border border-gray-300">Doctor Consultation Fee</td>
                  <td className="p-3 border border-gray-300 text-right">1</td>
                  <td className="p-3 border border-gray-300 text-right">{doctorFee.toFixed(2)}</td>
                  <td className="p-3 border border-gray-300 text-right font-medium">{doctorFee.toFixed(2)}</td>
                </tr>
              )}
              {treatments && treatments.map((treatment, index) => (
                <tr key={index}>
                  <td className="p-3 border border-gray-300">{doctorFee && doctorFee > 0 ? index + 2 : index + 1}</td>
                  <td className="p-3 border border-gray-300">{treatment.name}</td>
                  <td className="p-3 border border-gray-300 text-right">1</td>
                  <td className="p-3 border border-gray-300 text-right">{treatment.price.toFixed(2)}</td>
                  <td className="p-3 border border-gray-300 text-right font-medium">{treatment.price.toFixed(2)}</td>
                </tr>
              ))}
              {prescription?.tests?.filter(t => t.price && t.price > 0).map((test, index) => {
                const prevItemsCount = (doctorFee && doctorFee > 0 ? 1 : 0) + (treatments?.length || 0);
                return (
                  <tr key={index}>
                    <td className="p-3 border border-gray-300">{prevItemsCount + index + 1}</td>
                    <td className="p-3 border border-gray-300">{test.name} (Test)</td>
                    <td className="p-3 border border-gray-300 text-right">1</td>
                    <td className="p-3 border border-gray-300 text-right">{(test.price || 0).toFixed(2)}</td>
                    <td className="p-3 border border-gray-300 text-right font-medium">{(test.price || 0).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-6 flex justify-end">
          <div className="w-80 border p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount && discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span className="font-medium">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t-2 border-gray-800 font-bold text-lg">
                <span>Total Amount:</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t-2 border-gray-300">
          <div className="flex justify-between items-end">
            <div className="text-xs text-gray-500">
              <p>Thank you for your visit!</p>
              <p className="mt-2">Generated on: {format(new Date(), "PPP 'at' p")}</p>
            </div>
            <div className="text-right">
              <div className="mb-8 h-16 border-b-2 border-gray-800 w-48"></div>
              <p className="text-sm font-semibold">Dr. {doctor.firstName} {doctor.lastName}</p>
              <p className="text-xs text-gray-600">{doctor.specialty}</p>
              <p className="text-xs text-gray-500 mt-2">Authorized Signature</p>
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

