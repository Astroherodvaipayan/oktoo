'use client';

import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthDialog } from '../create/_components/authenticate-dialog';
import { cn } from '@/lib/utils';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { RainbowButton } from '@/components/ui/rainbow-button';

const AppCTASections = () => {
  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      <a href="/dash" className="rounded-lg bg-zinc-900 p-6 text-center transition-colors hover:bg-zinc-800">
        <span className="text-4xl mb-4">💸</span>
        <h2 className="mb-1 text-base font-medium text-zinc-50">Send Money</h2>
        <p className="text-sm text-zinc-500">Transfer any token using emojis as usernames</p>
      </a>
      <a href="/dash" className="rounded-lg bg-zinc-900 p-6 text-center transition-colors hover:bg-zinc-800">
        <span className="text-4xl mb-4">📥</span>
        <h2 className="mb-1 text-base font-medium text-zinc-50">Receive Money</h2>
        <p className="text-sm text-zinc-500">Get tokens sent to your emoji username</p>
      </a>
      <a href="/dash" className="rounded-lg bg-zinc-900 p-6 text-center transition-colors hover:bg-zinc-800">
        <span className="text-4xl mb-4">📝</span>
        <h2 className="mb-1 text-base font-medium text-zinc-50">Transaction History</h2>
        <p className="text-sm text-zinc-500">View your token transfer history</p>
      </a>
      <a href="/dash" className="rounded-lg bg-zinc-900 p-6 text-center transition-colors hover:bg-zinc-800">
        <span className="text-4xl mb-4">👤</span>
        <h2 className="mb-1 text-base font-medium text-zinc-50">Profile</h2>
        <p className="text-sm text-zinc-500">Manage your emoji username and settings</p>
      </a>
      <a
        href="https://x.com/oktopayit"
        className="rounded-lg bg-zinc-900 p-6 text-center transition-colors hover:bg-zinc-800"
      >
        <span className="text-4xl mb-4">❓</span>
        <h2 className="mb-1 text-base font-medium text-zinc-50">Help & Support</h2>
        <p className="text-sm text-zinc-500">Get assistance with your token transfers</p>
      </a>
    </div>
  );
};

const ListedActions = () => {
  return (
    <section className="my-20 max-w-[450px] mx-auto">
      <div className="space-y-7">
        <div className="flex items-start">
          <span className="text-3xl mr-3 mt-1">🌍</span>
          <div>
            <h3 className="font-medium text-zinc-100 text-lg mb-1 leading-tight tracking-wide">Global Payments</h3>
            <p className="text-zinc-500 text-sm">
              Easily send and receive payments across different currencies with Solana's fast network.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <span className="text-3xl mr-3 mt-1">📁</span>
          <div>
            <h3 className="font-medium text-zinc-100 text-lg mb-1 leading-tight tracking-wide">
              Transaction Management
            </h3>
            <p className="text-zinc-500 text-sm">Track all your transactions.</p>
          </div>
        </div>
        <div className="flex items-start">
          <span className="text-3xl mr-3 mt-1">⏱️</span>
          <div>
            <h3 className="font-medium text-zinc-100 text-lg mb-1 leading-tight tracking-wide">
              Efficient Payment Tracking
            </h3>
            <p className="text-zinc-500 text-sm">
              Monitor your payment history. Notifications for transaction completions.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <span className="text-3xl mr-3 mt-1">🔔</span>
          <div>
            <h3 className="font-medium text-zinc-100 text-lg mb-1 leading-tight tracking-wide">
              Instant Payment Alerts
            </h3>
            <p className="text-zinc-500 text-sm">
              Get notified instantly about transaction statuses. Stay updated on all your activities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function LandingContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuthenticationStore();
  const router = useRouter();
  return (
    <>
      <main className="font-sans relative mx-auto min-h-screen">
        <div className="flex min-h-screen flex-row">
          <div className="flex flex-grow flex-col bg-black">
            <div className="mx-auto max-w-3xl p-6">
              <header className="mx-auto mb-12 mt-24 flex max-w-[320px] flex-col items-center justify-center text-center">
                <img className="w-28 h-28 self-center" src="/logo.webp" />
                <h1 className="mb-1.5 text-2xl text-zinc-100">emoji pay</h1>
                <p className="text-zinc-400">
                  send crypto using only emojis. No wallets, no hassle—just your email and a unique, secure emoji
                  handle.
                </p>
                <div className="mt-5 flex flex-col items-center">
                  <Link href="/create">
                    <RainbowButton>Get yours!</RainbowButton>
                  </Link>
                  <div className="z-10 flex mt-2 items-center justify-center">
                    <div
                      className={cn(
                        'group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800',
                      )}
                      onClick={() => {
                        if (user) {
                          router.push('/dash');
                          return;
                        }
                        setAuthOpen(true);
                      }}
                    >
                      <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                        <span>💲 Send a payment</span>
                      </AnimatedShinyText>
                    </div>
                  </div>
                </div>
              </header>
              <AppCTASections />
              <ListedActions />
              <AuthDialog
                onClose={() => {
                  setAuthOpen(false);
                }}
                open={authOpen}
                emojis=""
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="font-sans bg-muted border-t px-4 md:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex flex-row items-center gap-2 text-center justify-center">
            <img className="h-4 w-4" src="/logo.webp" />
            <h1 className="text-primary text-sm text-center font-bold hover:underline">emoji pay</h1>
          </div>
        </div>
        <div className="flex  flex-col sm:flex-row  items-center gap-4 text-sm text-muted-foreground">
          <Link href="https://x.com/oktopayit" prefetch={false}>
            Terms & Conditions
          </Link>
          <Link href="https://x.com/oktopayit" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="https://x.com/oktopayit" prefetch={false}>
            Contact
          </Link>
          <span className="text-white">© Copyright {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}
