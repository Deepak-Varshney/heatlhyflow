'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import OverviewSkeleton from './overview-skeleton';

type OverviewLoadingContextValue = {
  setIsLoading: (value: boolean) => void;
};

const OverviewLoadingContext = createContext<OverviewLoadingContextValue | null>(null);

export function useOverviewLoading() {
  const context = useContext(OverviewLoadingContext);
  if (!context) {
    throw new Error('useOverviewLoading must be used within OverviewShell');
  }
  return context;
}

export default function OverviewShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const searchKey = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    setIsLoading(false);
  }, [searchKey]);

  return (
    <OverviewLoadingContext.Provider value={{ setIsLoading }}>
      {isLoading ? <OverviewSkeleton /> : children}
    </OverviewLoadingContext.Provider>
  );
}
