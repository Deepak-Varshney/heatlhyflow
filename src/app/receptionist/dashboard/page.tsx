import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Activity, MessageSquare, CreditCard } from "lucide-react";
import Link from "next/link";
import { IPatient } from '@/models/Patient';
import { IUser } from '@/models/User';
import { getAllDoctors } from '@/utilties/doctors';
import { getAllPatients } from '@/utilties/patients';
import { getMongoUser } from "@/lib/CheckUser";
import AppointmentBooking from '@/components/appointment-form';
import { getDashboardData } from "@/data-function/receptionist/dashboard";
import { getSubscriptionContext } from "@/lib/subscription";
import { SubscriptionStatus } from "@/components/subscription/subscription-status";
import { SubscriptionGuard } from "@/components/subscription/subscription-guard";

const ReceptionistDashboard = async () => {
  const user = await getMongoUser();
  const stats = await getDashboardData();
  const patients: IPatient[] = await getAllPatients()
  const doctors: IUser[] = await getAllDoctors()
  const subscriptionContext = await getSubscriptionContext();
  
  return (
    <div className="space-y-8 m-4">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.imageUrl} alt={`${user?.firstName} ${user?.lastName}`} />
            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
            <p className="text-muted-foreground">Here is a summary of your clinic activity today.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/billing">
            <Button variant="outline" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription Status */}
      {subscriptionContext && (
        <div className="mb-6">
          <SubscriptionStatus subscription={subscriptionContext} />
        </div>
      )}

      {/* Appointment Booking - Protected by subscription */}
      <SubscriptionGuard feature="unlimited_appointments" fallback={
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Appointment Booking</CardTitle>
            <p className="text-muted-foreground">Upgrade to Professional plan to access unlimited appointment booking</p>
          </CardHeader>
          <CardContent>
            <Link href="/billing">
              <Button>Upgrade Plan</Button>
            </Link>
          </CardContent>
        </Card>
      }>
        <Card>
          <CardHeader>
            <CardTitle>Quick Appointment Booking</CardTitle>
            <p className="text-muted-foreground">Book appointments for patients</p>
          </CardHeader>
          <CardContent>
            <AppointmentBooking
              patients={patients}
              doctors={doctors}
            />
          </CardContent>
        </Card>
      </SubscriptionGuard>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/receptionist/appointments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{`Today&apos;s Appointments`}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todaysAppointments}</div>
              <p className="text-xs text-muted-foreground">Total {stats.upcomingAppointments} In the next 7 days</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/receptionist/patients">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">In your Clinic</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">In your Clinic</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;