import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { User, Wallet } from '@prisma/client';

export interface AuthenticationState {
  user: User | null;
  wallets: Wallet[] | null;
  googleIdToken: string | null;
  saveInformation: (user: User) => void;
  saveWalletsInformation: (wallets: Wallet[]) => void;
  removeInformation: () => void;
  saveGoogleIdToken: (token: string) => void;
}

const initialState = {
  user: null,
  wallets: null,
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
      saveWalletsInformation: (wallets: Wallet[]) => {
        set({ wallets });
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
