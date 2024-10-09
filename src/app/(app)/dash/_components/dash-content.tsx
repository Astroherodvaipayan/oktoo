'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthenticationStore } from '@/utils/auth-store';
import Link from 'next/link';
import { useOkto } from 'okto-sdk-react';
import { CoinPicker } from './coin-picker';
import { useEffect, useState } from 'react';

const DashContent = () => {
  const { removeInformation, wallets, user } = useAuthenticationStore();
  const { getWallets } = useOkto();
  const [selectedWallet, setSelectedWallet] = useState(wallets?.[0]?.address || '');
  const [destination, setDestination] = useState(''); // Created state for the input of destination

  useEffect(() => {
    if (wallets?.[0]?.address && !selectedWallet) {
      setSelectedWallet(wallets[0].address);
    }
  }, [wallets, selectedWallet]);

  const handleWalletChange = (wallet) => {
    setSelectedWallet(wallet);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="mx-auto gap-8 pt-4 bg-background bg-black px-4 md:px-6 flex items-center justify-between h-16 max-w-2xl">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span>🙂‍↔️</span>
          <span className="text-lg font-semibold">emoji pay</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="#send">
            <Button variant="outline">💸 Send now!</Button>
          </Link>
          <Link href="#portfolio">
            <Button variant="outline">💼 Portfolio</Button>
          </Link>
          <Link href="#portfolio">
            <Button variant="outline">🔙 History</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              removeInformation();
              window.location.href = '/';
            }}
          >
            ⇲ Logout
          </Button>
        </div>
      </header>
      <main className="flex-1py-12 md:py-24">
        <div id="send" className="container grid rounded-lg gap-8 px-4 md:px-6 mt-4">
          <div className="bg-muted rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-2xl">💸 Send now!</h1>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="from" className="text-sm font-medium min-w-[40%]">
                    🤑 How much?
                  </label>
                  <div className="flex items-center gap-2">
                    <CoinPicker selectedWallet={selectedWallet} onValueChange={handleWalletChange} />
                  </div>
                </div>
                <Input id="from" type="number" placeholder="0.0" className="text-2xl font-semibold" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="to" className="text-sm font-medium">
                    Destination: Put here the destination emojis.
                  </label>
                </div>
                <Input
                  id="to"
                  value={destination}
                  onChange={handleDestinationChange}
                  placeholder="💲💲💲💲💲💲"
                  className="text-2xl font-semibold"
                />
              </div>
              <Button className="w-full" disabled={!destination.length || !selectedWallet}>
                🏌️ Send now!
              </Button>
            </div>
          </div>
          {/* <div className="bg-muted rounded-lg shadow-lg p-6 md:p-8 grid gap-6">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Exchange Rate</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">1 ETH</span>
                  <span className="text-muted-foreground">≈ 1,800 USDC</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Liquidity</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">$5.2M</span>
                  <span className="text-muted-foreground">(ETH-USDC)</span>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recent Swaps</span>
                <Link href="#" className="text-sm font-medium" prefetch={false}>
                  View All
                </Link>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
     
                    <div>
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-muted-foreground text-sm">Swapped 0.5 ETH for 900 USDC</div>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">2 minutes ago</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                   
                    <div>
                      <div className="text-sm font-medium">Jane Doe</div>
                      <div className="text-muted-foreground text-sm">Swapped 1 ETH for 1,800 USDC</div>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">10 minutes ago</div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </main>
      <footer className="font-sans bg-muted border-t px-4 md:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🙂‍↔️</span>
          <span className="text-sm font-medium">emoji pay</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="https://x.com/emojipayit" prefetch={false}>
            Contact
          </Link>
          <span>Built on {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default DashContent;
