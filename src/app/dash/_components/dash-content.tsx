'use client';

import { Button } from '@/components/ui/button';
import { useAuthenticationStore } from '@/utils/auth-store';
import Link from 'next/link';
import { useOkto } from 'okto-sdk-react';
import { useEffect, useState } from 'react';
import PortfolioList from './portfolio-list';
import SendTokens from './send-tokens';
import OrderList from './order-list';

const DashContent = () => {
  const { removeInformation, wallets, user } = useAuthenticationStore();
  const [selectedWallet, setSelectedWallet] = useState(wallets?.[0]?.address || '');

  useEffect(() => {
    if (wallets?.[0]?.address && !selectedWallet) {
      setSelectedWallet(wallets[0].address);
    }
  }, [wallets, selectedWallet]);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="mx-auto gap-8  bg-background bg-black px-4 md:px-6 flex items-center justify-between h-16 max-w-full w-2xl">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <div className="flex flex-row items-center gap-2 text-center justify-center">
            <img className="h-5 w-5" src="/logo.webp" />
            <h1 className="text-primary text-lg text-center font-bold hover:underline">emoji pay</h1>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              removeInformation();
              window.location.href = '/';
            }}
          >
            <div className="flex flex-col">
              <span>
                <b>Logged in as </b>
                {user?.emojis}
              </span>
              <span className="text-zinc-400">Logout</span>
            </div>
          </Button>
        </div>
      </header>
      <div className="flex items-center md:gap-2 items-center flex justify-center">
        <Link href="#send">
          <Button variant="outline" className="px-1 md:px-4">
            💸 Send now!
          </Button>
        </Link>
        <Link href="#portfolio">
          <Button variant="outline" className="px-1 md:px-4">
            💼 Portfolio
          </Button>
        </Link>
        <Link href="#history">
          <Button variant="outline" className="px-1 md:px-4">
            🔙 History
          </Button>
        </Link>
      </div>
      <main className="flex-1 pt-6">
        <SendTokens />
      </main>
      <div className="px-4 sm:p-8 sm:container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-12 mt-4 sm:mt-0">
        <div className="min-h-[30vh] bg-muted p-4 rounded-lg" id="#portfolio">
          <h1 className="text-2xl mb-4">💼 Portfolio</h1>
          <PortfolioList />
        </div>
        <div className="min-h-[30vh] bg-muted p-4 rounded-lg" id="#history">
          <h1 className="text-2xl mb-4">🔙 History</h1>
          <OrderList />
        </div>
      </div>
      <footer className="font-sans bg-muted border-t px-4 md:px-6 py-6 flex items-center justify-between">
        <div className="flex flex-row items-center gap-2 text-center justify-center">
          <img className="h-4 w-4" src="/logo.webp" />
          <h1 className="text-primary text-sm text-center font-bold hover:underline">emoji pay</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
          <Link href="https://x.com/emojipayit" prefetch={false}>
            Terms & Conditions
          </Link>
          <Link href="https://x.com/emojipayit" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="https://x.com/emojipayit" prefetch={false}>
            Contact
          </Link>
          <span className="text-white">© Copyright {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default DashContent;
