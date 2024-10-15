import { GlobalAppToken } from '@/modules/general/types';

export const SOLANA_MAINNET: GlobalAppToken = {
  name: 'Solana',
  symbol: 'SOL',
  description: 'Native token of the Solana blockchain, used for transactions and staking.',
  address: '',
  image: '/tokens/solana.svg',
};

export const USDC_MAINNET: GlobalAppToken = {
  name: 'USDC',
  symbol: 'USDC',
  description: 'Stablecoin pegged to the US dollar, widely used for digital payments and trading.',
  address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  image: '/tokens/usdc.svg',
};

export const TETHER_MAINNET: GlobalAppToken = {
  name: 'Tether',
  symbol: 'USDT',
  description: 'Popular stablecoin backed by USD, used for trading and transfers.',
  address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  image: '/tokens/tether.svg',
};

export const SOLANA_DEVNET: GlobalAppToken = {
  name: 'Solana Devnet',
  symbol: 'SOL_DEVNET',
  description: 'Test version of SOL for developers to experiment on Solana’s Devnet.',
  address: '',
  image: '/tokens/solana.svg',
};

export const USDC_DEVNET: GlobalAppToken = {
  name: 'USDC Devnet',
  symbol: 'USDC',
  description: 'Test version of USDC for use on the Solana Devnet.',
  address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  image: '/tokens/usdc.svg',
};

// export const TETHER_DEVNET: GlobalAppToken = {
//   name: 'Tether Devnet',
//   symbol: 'USDT',
//   description: 'Test version of USDT for experimenting on Solana’s Devnet.',
//   address: '',
//   image: '/tokens/tether.svg',
// };
