import '@/styles/globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import Web3Layout from './_components/Web3Layout';

export const metadata: Metadata = {
  metadataBase: new URL('https://emojipay.it'),
  title: 'Emojipay - Pay with Emojis',
  description:
    'Emojipay is a revolutionary payment system that uses Solana and other cryptocurrencies with emojis as usernames.',
  keywords: ['emojipay', 'solana', 'cryptocurrency', 'emoji', 'payment', 'wallet'],
  openGraph: {
    title: 'Emojipay - Pay with Emojis',
    description:
      'Emojipay is a revolutionary payment system that uses Solana and other cryptocurrencies with emojis as usernames.',
    images: '/banner/emojipay.png',
    type: 'website',
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
