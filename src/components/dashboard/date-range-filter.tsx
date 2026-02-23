'use client';

import { useMemo, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { useOverviewLoading } from '@/components/dashboard/overview-shell';

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

const presetRanges = (now: Date) => [
  {
    key: 'today',
    label: 'Today',
    from: formatDate(now),
    to: formatDate(now)
  },
  {
    key: 'yesterday',
    label: 'Yesterday',
    from: formatDate(subDays(now, 1)),
    to: formatDate(subDays(now, 1))
  },
  {
    key: 'this-week',
    label: 'This Week',
    from: formatDate(startOfWeek(now, { weekStartsOn: 1 })),
    to: formatDate(endOfWeek(now, { weekStartsOn: 1 }))
  },
  {
    key: 'this-month',
    label: 'This Month',
    from: formatDate(startOfMonth(now)),
    to: formatDate(endOfMonth(now))
  }
];

export default function DateRangeFilter() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useOverviewLoading();

  const today = useMemo(() => new Date(), []);
  const presets = useMemo(() => presetRanges(today), [today]);
  const fromValue = searchParams.get('from') || formatDate(today);
  const toValue = searchParams.get('to') || formatDate(today);
  const presetValue = searchParams.get('preset') || 'today';

  const applyRange = (nextRange: { from: string; to: string; preset: string }) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('from', nextRange.from);
    params.set('to', nextRange.to);
    params.set('preset', nextRange.preset);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='flex flex-wrap items-center gap-2'>
        {presets.map((preset) => (
          <Button
            key={preset.key}
            size='sm'
            variant={presetValue === preset.key ? 'default' : 'outline'}
            onClick={() =>
              applyRange({ from: preset.from, to: preset.to, preset: preset.key })
            }
            disabled={isPending}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Input
          type='date'
          value={fromValue}
          onChange={(event) =>
            applyRange({ from: event.target.value, to: toValue, preset: 'custom' })
          }
          className='w-[140px]'
          disabled={isPending}
        />
        <span className='text-xs text-muted-foreground'>to</span>
        <Input
          type='date'
          value={toValue}
          onChange={(event) =>
            applyRange({ from: fromValue, to: event.target.value, preset: 'custom' })
          }
          className='w-[140px]'
          disabled={isPending}
        />
        <Button
          size='sm'
          variant='outline'
          onClick={() =>
            applyRange({
              from: formatDate(today),
              to: formatDate(today),
              preset: 'today'
            })
          }
          disabled={isPending}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
