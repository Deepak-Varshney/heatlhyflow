'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, History, HeartPulse, Weight } from 'lucide-react';
import { getAppointmentDetails } from '@/app/actions/appointment-actions';
import { getPatientById } from '@/app/actions/patient-actions';
import { PrescriptionForm } from '@/components/prescription-form';

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
    };
    appointments?: any[];
  };
  doctor?: { firstName: string; lastName: string; specialty: string };
  prescription?: any;
  doctorFee?: number;
  discount?: number;
  totalAmount?: number;
};

export default function ConsultationClientPage({ initialAppointment }: { initialAppointment: PopulatedAppointment }) {
  const [appointment, setAppointment] = useState<PopulatedAppointment>(initialAppointment);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSuccess = async () => {
    setIsLoading(true);
    try {
      const updatedData = await getAppointmentDetails(appointment._id);
      if (updatedData) setAppointment(updatedData);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  useEffect(() => {
    const fetchPatientHistory = async () => {
      if (appointment.patient) {
        try {
          const patientData: any = await getPatientById(appointment.patient._id);
          if (patientData) {
            setPatientHistory(patientData.appointments.filter((appt: any) => appt._id !== appointment._id));
          }
        } catch (error) {
          console.error('Failed to fetch patient history:', error);
        }
      }
    };
    fetchPatientHistory();
  }, [appointment.patient, appointment._id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Consultation Room</h1>
        <Badge variant="outline" className="text-base px-4 py-1">
          {appointment.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Patient Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-semibold">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Age</p>
                <p className="font-semibold">{calculateAge(appointment.patient.dateOfBirth)} years</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <HeartPulse className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-muted-foreground text-xs">BP</p>
                  <p className="font-semibold">{appointment.patient.bp || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-muted-foreground text-xs">Weight</p>
                  <p className="font-semibold">{appointment.patient.weight ? `${appointment.patient.weight} kg` : 'N/A'}</p>
                </div>
              </div>
              <hr className="my-2" />
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="text-sm">{appointment.patient.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Phone</p>
                <p className="text-sm">{appointment.patient.phoneNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Address</p>
                <p className="text-sm">{appointment.patient.address}</p>
              </div>
              {appointment.patient.emergencyContact && (
                <div>
                  <p className="text-muted-foreground text-xs">Emergency Contact</p>
                  <p className="text-sm">
                    {appointment.patient.emergencyContact.name} ({appointment.patient.emergencyContact.phone})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" /> Patient History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patientHistory.length > 0 ? (
                <ul className="space-y-3 text-sm max-h-[400px] overflow-y-auto">
                  {patientHistory.map((appt: any) => (
                    <li key={appt._id} className="border-b pb-2 last:border-b-0">
                      <p className="font-semibold">
                        {format(new Date(appt.startTime), 'PPP')}
                        <Badge variant="secondary" className="ml-2">
                          {appt.status}
                        </Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dr. {appt.doctor?.lastName || 'Unknown'}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No previous appointment history found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Prescription/Treatment */}
        <div className="lg:col-span-2">
          {appointment.prescription ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" /> Consultation Completed
                </CardTitle>
                <CardDescription>
                  Prescription issued on {format(new Date(appointment.startTime), 'PPP, p')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">The prescription has been successfully created and saved.</p>
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                      ✓ Consultation completed successfully
                    </p>
                  </div>
                  {appointment.totalAmount && (
                    <Card className="bg-slate-50 dark:bg-slate-900">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total Amount</span>
                          <span className="text-primary">₹{appointment.totalAmount.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" /> Start Consultation
                  </CardTitle>
                  <CardDescription>
                    Create prescription, recommend tests, and note diagnosis below
                  </CardDescription>
                </CardHeader>
              </Card>
              <PrescriptionForm
                appointmentId={appointment._id.toString()}
                patientId={appointment.patient._id.toString()}
                onSaveSuccess={handleSaveSuccess}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
