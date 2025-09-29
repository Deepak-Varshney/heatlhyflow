import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// You would fetch these from your server actions
import { format } from "date-fns";
import PatientRegistrationDialog from "@/components/PatientRegistration";
import { getAllPatients } from "@/utilties/patients";
import { getAllDoctors } from "@/utilties/doctors";
import AppointmentBooking from "@/components/appointment-form";

const ReceptionistDashboard = async () => {
  // In a real app, you'd fetch this data from your database
  // const todaysAppointments = await getTodaysAppointments();
  const patients = await getAllPatients();
  const doctors = await getAllDoctors();

  return (
    <div className="m-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receptionist Dashboard</h1>
          <p className="text-muted-foreground">Manage patients and book appointments.</p>
        </div>
        <div className="flex gap-2">
          <PatientRegistrationDialog />
          <AppointmentBooking patients={patients} doctors={doctors} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{`Today's Appointments`}</CardTitle>
          <CardDescription>
            A list of all appointments scheduled for today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {todaysAppointments.length > 0 ? (
                todaysAppointments.map((appt) => (
                  <TableRow key={appt._id}>
                    <TableCell className="font-medium">
                      {format(new Date(appt.startTime), "p")}
                    </TableCell>
                    <TableCell>{appt.patient.firstName} {appt.patient.lastName}</TableCell>
                    <TableCell>Dr. {appt.doctor.lastName}</TableCell>
                    <TableCell>
                      <Badge>{appt.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No appointments scheduled for today.
                  </TableCell>
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceptionistDashboard;

