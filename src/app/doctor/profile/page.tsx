import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Briefcase, Star, Info } from "lucide-react";
import { getMongoUser } from "@/lib/CheckUser";
import ManageAvailabilityDialog from "@/components/doctor-availability";
import ManageTreatmentsDialog from "@/components/doctor-treatments";
import ManageClinicSettingsDialog from "@/components/doctor-clinic-settings";
import { UserProfile } from "@clerk/nextjs";  // Importing the UserProfile component from Clerk

const DoctorProfilePage = async () => {
  const user = await getMongoUser();

 

  return (
    <div className="p-3 overflow-auto h-[90vh]">
      <h1 className="text-3xl font-bold tracking-tight">My Professional Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Profile Card & Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-sm">
                    <AvatarImage src={user.imageUrl} alt={`Dr. ${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-4xl">{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-2xl font-bold">Dr. {user.firstName} {user.lastName}</h2>
                <Badge className="mt-2 text-md" variant="secondary">{user.specialty}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Not Provided</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Professional Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>An overview of my expertise and qualifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Experience</h3>
                  <p className="text-primary text-xl font-bold">{user.experience} years</p>
                  <p className="text-sm text-muted-foreground">Providing expert care in {user.specialty}.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-500/10 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Specialty</h3>
                  <p className="text-muted-foreground">{user.specialty}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <Info className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">About Me</h3>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{user.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional: Manage Availability Dialog */}
          <div className="space-y-4">
            <ManageAvailabilityDialog />
            <ManageTreatmentsDialog />
            <ManageClinicSettingsDialog />
          </div>
        </div>
      </div>

      {/* UserProfile Section (could be placed in a footer or as a separate section) */}
      <div className="mt-12">
        <UserProfile />
      </div>
    </div>
  );
};

export default DoctorProfilePage;
