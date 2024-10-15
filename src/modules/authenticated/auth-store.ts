import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { Transaction, User, Wallet } from '@prisma/client';
import { Portfolio } from 'okto-sdk-react';

export interface AuthenticationState {
  user: User | null;
  wallets: Wallet[] | null;
  portfolio: Portfolio[] | null;
  activity: Transaction[] | null;
  googleIdToken: string | null;
  savePortfolio: (newPortfolio: Portfolio[] | null) => void;
  saveInformation: (user: User) => void;
  saveWalletsInformation: (wallets: Wallet[] | null) => void;
  saveActivityTransactions: (txs: Transaction[] | null) => void;
  removeInformation: () => void;
  saveGoogleIdToken: (token: string) => void;
}

const initialState = {
  user: null,
  wallets: null,
  portfolio: null,
  activity: null,
  googleIdToken: null,
};

const useAuthenticationStore = create<AuthenticationState>()(
  persist(
    (set) => ({
      ...initialState,
      saveInformation: (user: User) => {
        set({ user });
      },
      saveGoogleIdToken: (newGoogleIdToken: string) => {
        set({ googleIdToken: newGoogleIdToken });
      },
      saveWalletsInformation: (wallets: Wallet[] | null) => {
        set({ wallets });
      },
      saveActivityTransactions: (txs: Transaction[] | null) => {
        set({ activity: txs });
      },
      savePortfolio: (newPortfolio: Portfolio[] | null) => {
        set({ portfolio: newPortfolio });
      },
      removeInformation: () => {
        set(initialState);
      },
    }),
    {
      name: 'Authentication',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export { useAuthenticationStore };
