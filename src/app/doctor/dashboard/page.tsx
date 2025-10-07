import { getSubscriptionContext } from "@/lib/subscription";
import { SubscriptionStatus } from "@/components/subscription/subscription-status";
import { SubscriptionGuard } from "@/components/subscription/subscription-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  Activity, 
  MessageSquare, 
  CreditCard,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import RandomGlow from "@/components/effects/glow";

const DoctorDashboard = async () => {
  const subscriptionContext = await getSubscriptionContext();

  // Mock data for demonstration
  const stats = {
    todayAppointments: 8,
    totalPatients: 156,
    pendingTasks: 3,
    completedAppointments: 5
  };

  const recentAppointments = [
    { id: 1, patient: "John Doe", time: "09:00 AM", status: "Completed" },
    { id: 2, patient: "Jane Smith", time: "10:30 AM", status: "Completed" },
    { id: 3, patient: "Bob Johnson", time: "02:00 PM", status: "Upcoming" },
    { id: 4, patient: "Alice Brown", time: "03:30 PM", status: "Upcoming" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Upcoming": return "bg-blue-100 text-blue-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8 m-4 h-full">
      <RandomGlow />
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Manage your practice and patient care</p>
        </div>
        <div className="flex gap-2">
          <Link href="/billing">
            <Button variant="outline" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </Button>
          </Link>
          <Link href="/doctor/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription Status Banner */}
      {subscriptionContext && (
        <div className="mb-6">
          <SubscriptionStatus subscription={subscriptionContext} />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/doctor/appointments">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                +2 from yesterday
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/patients">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                +12 this month
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.completedAppointments / stats.todayAppointments) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Your latest patient appointments</CardDescription>
            </div>
            <Link href="/doctor/appointments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Section - Protected by Subscription */}
      <SubscriptionGuard feature="analytics">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Practice Analytics
            </CardTitle>
            <CardDescription>
              Detailed insights about your practice performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Patient Satisfaction</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Appointment Completion</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Follow-up Rate</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Revenue Growth</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </SubscriptionGuard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/doctor/appointments">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Schedule Appointment</h3>
                  <p className="text-sm text-muted-foreground">Book a new patient appointment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/patients">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Manage Patients</h3>
                  <p className="text-sm text-muted-foreground">View and update patient records</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <SubscriptionGuard feature="api" fallback={
          <Card className="opacity-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Settings className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-muted-foreground">API Access</h3>
                  <p className="text-sm text-muted-foreground">Upgrade to Professional plan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        }>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Settings className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">API Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure API integrations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </SubscriptionGuard>
      </div>
    </div>
  );
};

export default DoctorDashboard;