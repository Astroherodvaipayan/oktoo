'use client';
import { useAuthenticationStore } from '@/utils/auth-store';
import { useOkto } from 'okto-sdk-react';
import { useEffect, useState } from 'react';

export const AllPageLoaderContent = () => {
  return (
    <div className="h-screen flex w-screen overflow-hidden font-sans items-center justify-center align-center">
      <div className="max-w-2xl">
        <img className="w-28 h-28 self-center" src="/logo.webp" />
        <h1 className="mb-1.5 text-2xl text-zinc-100">emoji pay</h1>

        <span>We are loading 😇😇😇</span>
      </div>
    </div>
  );
};

const WrapperRefresh = ({ children }) => {
  const { authenticate } = useOkto();
  const { googleIdToken } = useAuthenticationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!googleIdToken) {
      return;
    }
    setIsLoading(true);
    authenticate(googleIdToken, async (authResponse, error) => {
      setIsLoading(false);
      if (authResponse) {
        console.log('Authentication check: ', authResponse);
      }

      if (error) {
        console.error('Authentication error:', error);
      } else {
        setIsLoading(false);
      }
    });
  }, [googleIdToken]);

  if (isLoading) {
    return <AllPageLoaderContent />;
  }
  return children;
};

const AppLayout = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <AllPageLoaderContent />;
  }
  return <WrapperRefresh>{children}</WrapperRefresh>;
};

export default AppLayout;
