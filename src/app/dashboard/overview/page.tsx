import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  IconCalendar,
  IconClock,
  IconClipboardCheck,
  IconReceipt,
  IconStethoscope,
  IconUserCheck
} from '@tabler/icons-react';
import { getDashboardOverview } from '@/actions/dashboard-actions';
import DateRangeFilter from '@/components/dashboard/date-range-filter';
import OverviewShell from '@/components/dashboard/overview-shell';
import DashboardActionButtons from '@/components/dashboard/dashboard-action-buttons';
import RecentAppointmentsCard from '@/components/dashboard/recent-appointments-card';
import RecentPatientsCard from '@/components/dashboard/recent-patients-card';
import { format, isSameDay } from 'date-fns';
import Link from 'next/link';
import { getAllPatients } from '@/utilties/patients';
import { getAllDoctors } from '@/app/actions/doctor-actions';

type PageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

const formatDateParam = (value?: string | string[]) => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

const formatRangeLabel = (startISO: string, endISO: string) => {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (isSameDay(start, end)) {
    return format(start, 'MMM d, yyyy');
  }
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);

export default async function OverviewPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const dateFrom = formatDateParam(searchParams.from);
  const dateTo = formatDateParam(searchParams.to);

  const overview = await getDashboardOverview({ dateFrom, dateTo });
  const patients = await getAllPatients();
  const doctors = await getAllDoctors();
  const role = overview.role;
  const isDoctor = role === 'DOCTOR';
  const isReceptionist = role === 'RECEPTIONIST';
  const displayName = `${overview.firstName || ''} ${overview.lastName || ''}`.trim();

  const headerTitle = isDoctor
    ? 'Doctor Dashboard'
    : isReceptionist
      ? 'Reception Dashboard'
      : 'Clinic Overview';

  const headerSubtitle = isDoctor
    ? 'Track your schedule, patients, and clinical tasks.'
    : isReceptionist
      ? 'Manage check-ins, appointments, and front desk workflow.'
      : 'Monitor operations, appointments, and performance.';

  const welcomeLabel = isDoctor
    ? `Welcome Dr. ${displayName || 'Doctor'}`
    : `Welcome ${displayName || 'back'}`;

  const rangeLabel = formatRangeLabel(overview.rangeStart, overview.rangeEnd);
  const rangeIsToday = isSameDay(new Date(overview.rangeStart), new Date()) &&
    isSameDay(new Date(overview.rangeEnd), new Date());

  const statCards = isDoctor
    ? [
        {
          label: 'Appointments',
          value: overview.appointmentsInRange.toString(),
          detail: rangeLabel,
          icon: <IconCalendar className='h-5 w-5' />
        },
        {
          label: 'Upcoming Visits',
          value: overview.upcomingAppointments.length.toString(),
          detail: 'Next 5 listed',
          icon: <IconClock className='h-5 w-5' />
        },
        {
          label: 'New Patients',
          value: overview.newPatientsCount.toString(),
          detail: rangeLabel,
          icon: <IconUserCheck className='h-5 w-5' />
        },
        {
          label: rangeIsToday ? "Today's Collection" : 'Collection',
          value: formatCurrency(overview.collectionTotal),
          detail: rangeIsToday ? 'Collected today' : rangeLabel,
          icon: <IconReceipt className='h-5 w-5' />
        }
      ]
    : [
        {
          label: 'Appointments',
          value: overview.appointmentsInRange.toString(),
          detail: rangeLabel,
          icon: <IconUserCheck className='h-5 w-5' />
        },
        {
          label: 'Upcoming Visits',
          value: overview.upcomingAppointments.length.toString(),
          detail: 'Next 5 listed',
          icon: <IconCalendar className='h-5 w-5' />
        },
        {
          label: 'New Patients',
          value: overview.newPatientsCount.toString(),
          detail: rangeLabel,
          icon: <IconUserCheck className='h-5 w-5' />
        },
        {
          label: 'Total Patients',
          value: overview.totalPatients.toString(),
          detail: 'Organization total',
          icon: <IconClipboardCheck className='h-5 w-5' />
        }
      ];

  const quickActions = isDoctor
    ? [
        {
          label: 'Manage Patients',
          icon: <IconUserCheck className='h-4 w-4' />,
          href: '/dashboard/patients'
        },
        {
          label: 'Set Availability',
          icon: <IconStethoscope className='h-4 w-4' />,
          href: '/dashboard/profile'
        }
      ]
    : [
        {
          label: 'View Appointments',
          icon: <IconClock className='h-4 w-4' />,
          href: '/dashboard/appointments'
        }
      ];

  return (
    <PageContainer>
      <OverviewShell>
        <div className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-col gap-4 rounded-2xl border border-primary/10 bg-linear-to-r from-primary/10 via-background to-background p-6 shadow-sm'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.2em] text-primary/70'>
                Daily Command Center
              </p>
              <h2 className='text-3xl font-semibold tracking-tight'>{headerTitle}</h2>
              <p className='text-sm font-medium text-primary/80'>{welcomeLabel}</p>
              <p className='text-sm text-muted-foreground'>{headerSubtitle}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant='outline'
                  size='sm'
                  className='gap-2'
                  asChild
                >
                  <Link href={action.href}>
                    {action.icon}
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
            <DashboardActionButtons patients={patients} doctors={doctors} />
          </div>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='secondary'>Range: {rangeLabel}</Badge>
            </div>
            <DateRangeFilter />
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {statCards.map((card) => (
            <Card key={card.label} className='border-primary/10 bg-background/80'>
              <CardHeader className='gap-2'>
                <div className='flex items-center justify-between'>
                  <CardDescription className='text-xs uppercase tracking-wide'>
                    {card.label}
                  </CardDescription>
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    {card.icon}
                  </div>
                </div>
                <CardTitle className='text-3xl font-semibold'>{card.value}</CardTitle>
                <Badge variant='secondary' className='w-fit'>
                  {card.detail}
                </Badge>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-4 xl:grid-cols-7'>
          <RecentAppointmentsCard
            className='xl:col-span-4'
            appointments={overview.recentAppointments}
          />
          <RecentPatientsCard
            className='xl:col-span-3'
            patients={overview.recentPatients}
          />
        </div>
        </div>
      </OverviewShell>
    </PageContainer>
  );
}
