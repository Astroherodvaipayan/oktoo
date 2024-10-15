import { SOLANA_DEVNET, SOLANA_MAINNET, TETHER_MAINNET, USDC_DEVNET, USDC_MAINNET } from '../data';

export const getTokensList = (env: string) => {
  if (env === 'development') {
    return [SOLANA_DEVNET, USDC_DEVNET];
  }
  return [SOLANA_MAINNET, USDC_MAINNET, TETHER_MAINNET];
};

export const getSolanaNetworkName = (env: string) => {
  return env === 'development' ? 'SOLANA_DEVNET' : 'SOLANA';
};
