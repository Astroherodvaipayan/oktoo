'use client';
import { useEffect } from 'react';
import DashContent from './_components/dash-content';
import { useAuthenticationStore } from '@/utils/auth-store';
import { redirect } from 'next/navigation';

export default function Dash() {
  const { user } = useAuthenticationStore();
  // useEffect works because Layout was in charge of
  // making sure we have already mounted the route
  useEffect(() => {
    if (!user?.emojis) {
      redirect('/create');
    }
  }, [user?.emojis]);

  return <DashContent />;
}
