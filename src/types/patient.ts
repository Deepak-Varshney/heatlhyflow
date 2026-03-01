export interface IPatient {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  occupation?: string;
  medicalHistory?: string;
  bp?: string;
  weight?: number;
  appointments?: Array<{ _id?: string } | string>;
  createdAt?: string;
}
