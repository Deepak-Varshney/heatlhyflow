import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ManageAvailabilityDialog from '@/components/doctor-availability';
import ManageClinicSettingsDialog from '@/components/doctor-clinic-settings';
import ManageTreatmentsDialog from '@/components/doctor-treatments';
import { getMongoUser } from '@/lib/CheckUser';
import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard : Profile'
};

const formatInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.trim()?.[0] || '';
  const last = lastName?.trim()?.[0] || '';
  const initials = `${first}${last}`.toUpperCase();
  return initials || 'NA';
};

export default async function ProfilePage() {
  const user = await getMongoUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const isDoctor = user.role === 'DOCTOR';

  return (
    <PageContainer>
      <div className='space-y-8'>
        <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight'>Your settings</h1>
            <p className='text-sm text-muted-foreground'>
              Manage your account, availability, and clinic preferences.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline'>{user.role}</Badge>
            <Badge variant='outline'>{user.verificationStatus}</Badge>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-[320px_1fr]'>
          <Card>
            <CardHeader>
              <CardTitle>Profile overview</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src={user.imageUrl || ''} alt={user.firstName} />
                  <AvatarFallback>{formatInitials(user.firstName, user.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-base font-semibold'>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className='text-sm text-muted-foreground'>{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Role</span>
                  <Badge variant='secondary'>{user.role}</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Verification</span>
                  <Badge variant='secondary'>{user.verificationStatus}</Badge>
                </div>
                {isDoctor && user.specialty && (
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Specialty</span>
                    <span className='font-medium'>{user.specialty}</span>
                  </div>
                )}
                {isDoctor && typeof user.experience === 'number' && (
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Experience</span>
                    <span className='font-medium'>{user.experience} yrs</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Doctor settings</CardTitle>
              </CardHeader>
              <CardContent>
                {isDoctor ? (
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-lg border bg-background p-4 shadow-sm'>
                      <p className='text-sm font-semibold'>Weekly availability</p>
                      <p className='text-sm text-muted-foreground'>
                        Set your working days and hours.
                      </p>
                      <div className='pt-4'>
                        <ManageAvailabilityDialog />
                      </div>
                    </div>
                    <div className='rounded-lg border bg-background p-4 shadow-sm'>
                      <p className='text-sm font-semibold'>Treatments and fees</p>
                      <p className='text-sm text-muted-foreground'>
                        Update consultation fees and services.
                      </p>
                      <div className='pt-4'>
                        <ManageTreatmentsDialog />
                      </div>
                    </div>
                    <div className='rounded-lg border bg-background p-4 shadow-sm'>
                      <p className='text-sm font-semibold'>Clinic settings</p>
                      <p className='text-sm text-muted-foreground'>
                        Keep your clinic details up to date.
                      </p>
                      <div className='pt-4'>
                        <ManageClinicSettingsDialog />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='rounded-lg border bg-background p-4 text-sm text-muted-foreground'>
                    Doctor settings are available for doctor accounts only.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
