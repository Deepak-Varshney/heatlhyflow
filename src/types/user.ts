export interface IAvailability {
  _id: string;
  startTime: string;
  endTime: string;
  status?: 'available' | 'booked';
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  imageUrl?: string;
}
