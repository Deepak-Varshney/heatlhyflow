// app/doctor/patients/page.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// In a real app, you would fetch this data from your Patient model
const DUMMY_PATIENTS = [
    { id: '1', name: 'John Doe', email: 'john@example.com', lastVisit: '2025-09-15' },
    { id: '2', name: 'Alice Smith', email: 'alice@example.com', lastVisit: '2025-09-20' },
];

const PatientsPage = async () => {
  // TODO: Fetch real patient data from your database
  const patients = DUMMY_PATIENTS;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Patient List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.lastVisit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientsPage;