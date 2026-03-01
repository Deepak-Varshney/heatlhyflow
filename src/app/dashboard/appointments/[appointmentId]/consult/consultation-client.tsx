'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, History, HeartPulse, Weight, ChevronDown, ChevronUp, Pill, TestTube, Activity } from 'lucide-react';
import { getAppointmentDetails } from '@/app/actions/appointment-actions';
import { getPatientById } from '@/app/actions/patient-actions';
import { PrescriptionForm } from '@/components/prescription-form';
import { PrintActions } from '../print-actions';

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
  treatments?: Array<{ treatment?: string; treatmentId?: string; name: string; price: number }>;
  doctorFee?: number;
  discount?: number;
  discountType?: 'amount' | 'percentage';
  discountValue?: number;
  totalAmount?: number;
};

export default function ConsultationClientPage({ initialAppointment }: { initialAppointment: PopulatedAppointment }) {
  const searchParams = useSearchParams();
  const forceEditPrescription = searchParams.get('editPrescription') === '1';
  const [appointment, setAppointment] = useState<PopulatedAppointment>(initialAppointment);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(forceEditPrescription || !initialAppointment.prescription);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  useEffect(() => {
    if (forceEditPrescription) {
      setIsEditing(true);
    }
  }, [forceEditPrescription, appointment.prescription]);

  const initialValues = useMemo(() => {
    if (!appointment.prescription) return undefined;
    const medicines = (appointment.prescription.medicines || []).map((med: any) => {
      const timings = med.timings || {};
      return {
        ...med,
        timings: {
          beforeBreakfast: timings.beforeBreakfast ?? timings.morning ?? false,
          afterBreakfast: timings.afterBreakfast ?? false,
          beforeLunch: timings.beforeLunch ?? false,
          afterLunch: timings.afterLunch ?? timings.afternoon ?? false,
          beforeDinner: timings.beforeDinner ?? false,
          afterDinner: timings.afterDinner ?? timings.night ?? false,
        },
      };
    });

    const treatments = (appointment.treatments || []).map((treatment: any) => ({
      treatmentId: treatment.treatmentId || "",
      name: treatment.name,
      price: treatment.price,
    }));

    return {
      chiefComplaint: appointment.prescription.chiefComplaint || "",
      diagnosis: appointment.prescription.diagnosis || "",
      medicines,
      tests: appointment.prescription.tests || [],
      notes: appointment.prescription.notes || "",
      treatments,
      doctorFee: appointment.doctorFee || 0,
      discountType: appointment.discountType || "amount",
      discountValue: appointment.discountValue ?? appointment.discount ?? 0,
    };
  }, [appointment]);

  const handleSaveSuccess = async () => {
    setIsLoading(true);
    try {
      const updatedData = await getAppointmentDetails(appointment._id);
      if (updatedData) setAppointment(updatedData);
      setIsEditing(false);
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
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-3xl font-bold">Consultation Room</h1>
        <div className="flex flex-wrap items-center gap-3">
          {String(appointment.status || '').toLowerCase() === 'completed' && <PrintActions appointment={appointment} />}
          <Badge variant="outline" className="text-base px-4 py-1">
            {appointment.status.toUpperCase()}
          </Badge>
        </div>
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
                <div className="space-y-3 max-h-125 overflow-y-auto">
                  {patientHistory.map((appt: any) => {
                    const isExpanded = expandedHistory === appt._id;
                    const hasPrescription = appt.prescription;
                    
                    return (
                      <div key={appt._id} className="border rounded-lg">
                        <button
                          onClick={() => setExpandedHistory(isExpanded ? null : appt._id)}
                          className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-start justify-between gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm">
                                {format(new Date(appt.startTime), 'MMM dd, yyyy')}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {appt.status}
                              </Badge>
                              {hasPrescription && (
                                <Badge variant="outline" className="text-xs">
                                  ✓ Prescribed
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Dr. {appt.doctor?.firstName || ''} {appt.doctor?.lastName || 'Unknown'}
                            </p>
                            {hasPrescription && appt.prescription.diagnosis && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {appt.prescription.diagnosis}
                              </p>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 shrink-0 mt-1" />
                          )}
                        </button>
                        
                        {isExpanded && hasPrescription && (
                          <div className="px-3 pb-3 space-y-3 border-t pt-3">
                            {appt.prescription.chiefComplaint && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Chief Complaint</p>
                                <p className="text-sm">{appt.prescription.chiefComplaint}</p>
                              </div>
                            )}
                            
                            {appt.prescription.diagnosis && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Diagnosis</p>
                                <p className="text-sm">{appt.prescription.diagnosis}</p>
                              </div>
                            )}
                            
                            {appt.prescription.medicines && appt.prescription.medicines.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                  <Pill className="h-3 w-3" /> Medicines ({appt.prescription.medicines.length})
                                </p>
                                <ul className="space-y-1 text-sm">
                                  {appt.prescription.medicines.map((med: any, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-muted-foreground">•</span>
                                      <span>{med.name} - {med.dosage}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {appt.prescription.tests && appt.prescription.tests.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                  <TestTube className="h-3 w-3" /> Tests Ordered ({appt.prescription.tests.length})
                                </p>
                                <ul className="space-y-1 text-sm">
                                  {appt.prescription.tests.map((test: any, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-muted-foreground">•</span>
                                      <span>{test.name}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {appt.treatments && appt.treatments.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                  <Activity className="h-3 w-3" /> Treatments ({appt.treatments.length})
                                </p>
                                <ul className="space-y-1 text-sm">
                                  {appt.treatments.map((treatment: any, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-muted-foreground">•</span>
                                      <span>{treatment.name} - ₹{treatment.price}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {appt.prescription.notes && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Clinical Notes</p>
                                <p className="text-sm">{appt.prescription.notes}</p>
                              </div>
                            )}
                            
                            {appt.totalAmount && (
                              <div className="pt-2 border-t">
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-semibold text-muted-foreground">Total Amount</p>
                                  <p className="text-sm font-semibold">₹{appt.totalAmount.toFixed(2)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {isExpanded && !hasPrescription && (
                          <div className="px-3 pb-3 border-t pt-3">
                            <p className="text-sm text-muted-foreground italic">No prescription details available.</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No previous appointment history found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Prescription/Treatment */}
        <div className="lg:col-span-2">
          {appointment.prescription && !isEditing ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" /> Consultation Completed
                  </CardTitle>
                  <CardDescription>
                    Prescription issued on {format(new Date(appointment.startTime), 'PPP, p')}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Prescription
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    ✓ Consultation completed successfully
                  </p>
                </div>

                {/* Chief Complaint */}
                {appointment.prescription.chiefComplaint && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Chief Complaint</h3>
                    <p className="text-sm text-muted-foreground">{appointment.prescription.chiefComplaint}</p>
                  </div>
                )}

                {/* Diagnosis */}
                {appointment.prescription.diagnosis && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Diagnosis</h3>
                    <p className="text-sm text-muted-foreground">{appointment.prescription.diagnosis}</p>
                  </div>
                )}

                {/* Medicines */}
                {appointment.prescription.medicines && appointment.prescription.medicines.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Pill className="h-4 w-4" /> Medicines ({appointment.prescription.medicines.length})
                    </h3>
                    <div className="space-y-2">
                      {appointment.prescription.medicines.map((med: any, idx: number) => (
                        <div key={idx} className="bg-muted p-3 rounded-md">
                          <p className="font-semibold text-sm">{med.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Dosage: {med.dosage || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tests */}
                {appointment.prescription.tests && appointment.prescription.tests.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <TestTube className="h-4 w-4" /> Tests ({appointment.prescription.tests.length})
                    </h3>
                    <div className="space-y-2">
                      {appointment.prescription.tests.map((test: any, idx: number) => (
                        <div key={idx} className="bg-muted p-3 rounded-md">
                          <p className="font-semibold text-sm">{test.name || 'N/A'}</p>
                          {test.notes && <p className="text-xs text-muted-foreground mt-1">{test.notes}</p>}
                          {test.price && <p className="text-xs text-muted-foreground mt-1">Price: ₹{test.price.toFixed(2)}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatments */}
                {appointment.treatments && appointment.treatments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Treatments ({appointment.treatments.length})
                    </h3>
                    <div className="space-y-2">
                      {appointment.treatments.map((treatment: any, idx: number) => (
                        <div key={idx} className="bg-muted p-3 rounded-md">
                          <p className="font-semibold text-sm">{treatment.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Price: ₹{treatment.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {appointment.prescription.notes && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Clinical Notes</h3>
                    <p className="text-sm text-muted-foreground">{appointment.prescription.notes}</p>
                  </div>
                )}

                {/* Total Amount */}
                {appointment.totalAmount && (
                  <Card className="bg-slate-50 dark:bg-slate-900 border-2 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total Amount</span>
                        <span className="text-primary">₹{appointment.totalAmount.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" /> Start Consultation
                    </CardTitle>
                    <CardDescription>
                      Create prescription, recommend tests, and note diagnosis below
                    </CardDescription>
                  </div>
                  {appointment.prescription && (
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  )}
                </CardHeader>
              </Card>
              <PrescriptionForm
                appointmentId={appointment._id.toString()}
                patientId={appointment.patient._id.toString()}
                prescriptionId={appointment.prescription?._id?.toString?.() || appointment.prescription?._id}
                initialValues={initialValues}
                onSaveSuccess={handleSaveSuccess}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
