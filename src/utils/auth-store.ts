import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { User } from '@prisma/client';

export interface WalletInfo {
  network_name: string;
  address: string;
  success: boolean;
}

export interface AuthenticationState {
  user: User | null;
  wallets: WalletInfo[] | null;
  saveInformation: (user: User) => void;
  saveWalletsInformation: (wallets: WalletInfo[]) => void;
  removeInformation: () => void;
}

const initialState = {
  user: null,
  wallets: null,
};

// @TODO: Add `AuthenticationState` type to the create fn
const useAuthenticationStore = create<AuthenticationState>()(
  persist(
    (set) => ({
      ...initialState,
      saveInformation: (user: User) => {
        set({ user });
      },
      saveWalletsInformation: (wallets: WalletInfo[]) => {
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
