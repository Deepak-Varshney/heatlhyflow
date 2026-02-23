import { Skeleton } from '@/components/ui/skeleton';

export default function OverviewSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-6'>
      <div className='rounded-2xl border border-primary/10 bg-linear-to-r from-primary/10 via-background to-background p-6 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='space-y-3'>
            <Skeleton className='h-3 w-40' />
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-72' />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Skeleton className='h-9 w-44' />
            <Skeleton className='h-9 w-44' />
            <Skeleton className='h-9 w-44' />
          </div>
        </div>
        <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
          <Skeleton className='h-6 w-40' />
          <div className='flex flex-wrap items-center gap-2'>
            <Skeleton className='h-9 w-16' />
            <Skeleton className='h-9 w-20' />
            <Skeleton className='h-9 w-20' />
            <Skeleton className='h-9 w-24' />
            <Skeleton className='h-9 w-32' />
            <Skeleton className='h-9 w-32' />
          </div>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='rounded-xl border border-primary/10 bg-background/80 p-6'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-9 w-9 rounded-full' />
            </div>
            <Skeleton className='mt-4 h-8 w-20' />
            <Skeleton className='mt-3 h-5 w-32' />
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-7'>
        <div className='xl:col-span-4 rounded-xl border border-border/60 bg-background p-6'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-5 w-44' />
            <Skeleton className='h-8 w-24' />
          </div>
          <div className='mt-4 space-y-3'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className='h-10 w-full' />
            ))}
          </div>
        </div>
        <div className='xl:col-span-3 rounded-xl border border-border/60 bg-background p-6'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-5 w-40' />
            <Skeleton className='h-8 w-20' />
          </div>
          <div className='mt-4 space-y-3'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className='h-10 w-full' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
