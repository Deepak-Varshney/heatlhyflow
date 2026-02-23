import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InviteMemberForm from './invite-member-form';
import { getOrganizationDashboardData } from '@/actions/organization-actions';

export default async function OrganizationPage() {
  const data = await getOrganizationDashboardData();

  if (!data) {
    return (
      <PageContainer>
        <div className='rounded-xl border border-border/60 bg-background p-8 text-center text-sm text-muted-foreground'>
          Organization details are not available yet.
        </div>
      </PageContainer>
    );
  }

  const { organization, members } = data;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-6'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Organization</h1>
          <p className='text-sm text-muted-foreground'>
            Manage clinic information and invite doctors or receptionists.
          </p>
        </div>

        <div className='grid gap-4 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Clinic Overview</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>Name</p>
                <p className='text-lg font-semibold'>{organization.name}</p>
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>Type</p>
                <p className='text-lg font-semibold'>{organization.type || 'Clinic'}</p>
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>Status</p>
                <Badge variant='secondary'>{organization.status}</Badge>
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>Members</p>
                <p className='text-lg font-semibold'>{members.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite Team</CardTitle>
            </CardHeader>
            <CardContent>
              <InviteMemberForm />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3'>
              {members.map((member: any) => (
                <div
                  key={member._id}
                  className='flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 bg-background/70 px-4 py-3'
                >
                  <div>
                    <p className='font-medium'>{member.firstName} {member.lastName}</p>
                    <p className='text-xs text-muted-foreground'>{member.email}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>{member.role}</Badge>
                    <Badge variant='secondary'>{member.verificationStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
