import { useAuthenticationStore } from '@/utils/auth-store';
import { PortfolioData, useOkto } from 'okto-sdk-react';
import { useEffect, useState } from 'react';
import { getIcon } from './coin-picker';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Clipboard } from 'lucide-react';

export const WalletAddress = ({ address, className }: { address: string; className?: string }) => {
  const [showCopyButton, setShowCopyButton] = useState(false);

  const handleWalletAddressClick = () => {
    navigator.clipboard.writeText(address);
    toast.success('Wallet address copied to clipboard');
  };

  return (
    <span
      className={cn('break-all hover:underline hover:text-primary cursor-pointer relative', className)}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
      onClick={() => {
        handleWalletAddressClick();
      }}
    >
      {address}
      {showCopyButton && (
        <span className="text-white text-xs underline-none flex flex-row items-center gap-2">
          <Clipboard className="w-4 h-4" />
          Copy Wallet
        </span>
      )}
    </span>
  );
};

const PortfolioList = () => {
  const [retrievedPortfolio, setRetrieverPortfolio] = useState<PortfolioData>();
  const { wallets } = useAuthenticationStore();
  const { getPortfolio } = useOkto();
  async function fetchPortfolio() {
    try {
      const portfolio = await getPortfolio();
      setRetrieverPortfolio(portfolio);
    } catch (error) {}
    return;
  }

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (!wallets) return <div>No wallets created with this account yet...</div>;

  return (
    <div id="portfolio">
      {wallets.map((wallet) => {
        const balanceOfToken = retrievedPortfolio?.tokens?.find((token) => wallet.network_name === token.network_name);
        return (
          <div className="flex flex-row gap-2" key={wallet.address}>
            <img src={getIcon(wallet.network_name)} className="mt-1 w-4 h-4" />
            <div>
              <h2>{wallet.network_name}</h2>
              <WalletAddress address={wallet.address} />
              <h2 className="text-zinc-400">
                {balanceOfToken ? `${balanceOfToken.quantity} ${balanceOfToken.token_name}` : 'Nothing'}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioList;
