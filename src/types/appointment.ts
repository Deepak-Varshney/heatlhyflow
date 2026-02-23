export interface IAppointment {
  _id: string;
  patient: {
    _id?: string;
    firstName: string;
    lastName: string;
  };
  doctorDetails: {
    _id?: string;
    firstName: string;
    lastName: string;
  };
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
}
