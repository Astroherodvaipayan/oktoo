import * as React from 'react';
import { useAuthenticationStore } from '@/utils/auth-store';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const getIcon = (type: string) => {
  if (type === 'SOLANA_DEVNET' || type === 'SOLANA') {
    return 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/white/sol.svg';
  }
  if (type === 'USDT') {
    return 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/white/usdt.svg';
  }

  // USDC
  return 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/white/usdc.svg';
};

export function CoinPicker({ selectedWallet, onValueChange }) {
  const { wallets } = useAuthenticationStore();
  const currentWallet = wallets?.find?.((item) => item.address === selectedWallet);
  return (
    <div className="flex flex-col flex-1 px-2">
      <Select value={selectedWallet} onValueChange={onValueChange}>
        <SelectTrigger className="w-[50%]">
          <SelectValue placeholder={currentWallet?.network_name || 'Select a Coin'} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {wallets?.map?.((wallet) => (
              <SelectItem key={wallet.address} value={wallet.address}>
                <div className="flex flex-row items-center gap-2">
                  <img src={getIcon(wallet.network_name)} className="w-4 h-4" /> <span>{wallet.network_name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <span className="text-sm break-all">
        Currently with the wallet: <b className="text-xs break-all">{currentWallet?.address}</b>
      </span>
    </div>
  );
}
