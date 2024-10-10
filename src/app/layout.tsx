import '@/styles/globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import Web3Layout from './_components/web3-layout';

export const metadata: Metadata = {
  metadataBase: new URL('https://emojipay.it'),
  title: 'Emojipay - Send crypto using only emojis.',
  description:
    'Send crypto using only emojis. No wallets, no hassle—just your email and a unique, secure emoji handle.',
  keywords: ['emojipay', 'solana', 'cryptocurrency', 'emoji', 'payment', 'wallet'],
  openGraph: {
    title: 'Emojipay - Pay with Emojis',
    description:
      'Send crypto using only emojis. No wallets, no hassle—just your email and a unique, secure emoji handle',
    images: '/banner/logo.webp',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/logo.webp',
        href: '/logo.webp',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth dark  font-sans">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Web3Layout>{children}</Web3Layout>
        <Toaster />
      </body>
    </html>
  );
}
