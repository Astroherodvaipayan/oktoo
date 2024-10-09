'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BuildType, OktoProvider } from 'okto-sdk-react';

export default function Web3Layout({ children }) {
  const OKTO_CLIENT_API_SECRET_KEY = process.env.NEXT_PUBLIC_OKTO_CLIENT_API_SECRET_KEY;
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const ENV = process.env.NEXT_PUBLIC_ENV;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <OktoProvider
        apiKey={OKTO_CLIENT_API_SECRET_KEY}
        buildType={ENV === 'production' ? BuildType.PRODUCTION : BuildType.SANDBOX}
      >
        {children}
      </OktoProvider>
    </GoogleOAuthProvider>
  );
}
