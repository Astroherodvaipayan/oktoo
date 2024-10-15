'use client';
import { useEffect, useState } from 'react';
import DashboardContent from '@/modules/user/components/dashboard/dashboard-content';
import { AllPageLoaderContent } from '@/modules/layout/components/all-screen-loader-content';

export default function Dash() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <AllPageLoaderContent appIsMounted={isHydrated} shouldMakeInitialAuthFetching>
      <DashboardContent />
    </AllPageLoaderContent>
  );
}
