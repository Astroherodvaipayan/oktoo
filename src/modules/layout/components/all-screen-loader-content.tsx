'use client';

import { useState } from 'react';
import InitialLoaderComponent from './initial-loader-component';
import AnimateSpinner from './emoji-spinner';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';

export const AllPageLoaderInnerContent = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col w-screen overflow-hidden font-sans items-center justify-center align-center">
      <div className="max-w-2xl">
        <img className="w-28 h-28 self-center" src="/logo.webp" />
        <h1 className="mb-1.5 text-2xl text-zinc-100">emoji pay</h1>
      </div>
      {children || <AnimateSpinner />}
    </div>
  );
};
export const AllPageLoaderContent = ({
  appIsMounted,
  shouldMakeInitialAuthFetching,
  children,
}: {
  appIsMounted: boolean;
  shouldMakeInitialAuthFetching?: boolean;
  children: React.ReactNode;
}) => {
  const [finishedInitialLoading, setFinishedInitialLoading] = useState(false);
  const { user } = useAuthenticationStore();
  if (shouldMakeInitialAuthFetching && !finishedInitialLoading) {
    return (
      <AllPageLoaderInnerContent>
        {appIsMounted && shouldMakeInitialAuthFetching && (
          <InitialLoaderComponent
            onDataCorrectlyFetched={() => {
              setFinishedInitialLoading(true);
            }}
          />
        )}
      </AllPageLoaderInnerContent>
    );
  }

  // probably redirecting from logout...
  if (appIsMounted && !user?.id) {
    return <AllPageLoaderInnerContent />;
  }
  return children;
};
