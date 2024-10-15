import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

// Store completely on USD
type TokenValue = number | null;
export interface TokenValuesManagementState {
  sol: TokenValue;
  usdc: TokenValue;
  usdt: TokenValue;
  updateAllTokensValue: (data: AllTokensUpdate) => void;
  removeInformation: () => void;
}

interface AllTokensUpdate {
  sol: TokenValue;
  usdc: TokenValue;
  usdt: TokenValue;
}

const initialState = {
  sol: null,
  usdt: null,
  usdc: null,
};

const useTokenValuesManagement = create<TokenValuesManagementState>()(
  persist(
    (set) => ({
      ...initialState,
      updateAllTokensValue: (data: AllTokensUpdate) => {
        set({ ...data });
      },
      removeInformation: () => {
        set(initialState);
      },
    }),
    {
      name: 'TokenValuesManagement',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export { useTokenValuesManagement };
