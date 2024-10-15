import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Clipboard } from 'lucide-react';
import { getTokensList } from '@/modules/token/utils';
import TokenInlinePreviewCard from '@/modules/token/components/token-inline-preview-card';
import { useTokenValuesManagement } from '@/modules/token/store/token-values-management';
import { getTokenPrice, useTotalPortfolioValue } from '@/modules/token/hooks/get-total-porfolio-value';
import TokenDetailsSheet from '@/modules/token/components/token-details-sheet';

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

const tokens = getTokensList(process.env.NEXT_PUBLIC_ENV);
const PortfolioList = () => {
  const { portfolio } = useAuthenticationStore();
  const tokenValues = useTokenValuesManagement();
  const [tokenSymbolDetails, setTokenSymbolDetails] = useState('');
  const totalPortfolioValue = useTotalPortfolioValue();

  return (
    <div>
      {tokens.map((item, index) => {
        // Find portfolio entry for this token
        const portfolioItem = portfolio.find((p) => p.token_name.toLowerCase() === item.symbol.toLowerCase());
        const tokenPriceInUsd = portfolioItem ? getTokenPrice(portfolioItem, tokenValues) : 0;
        // Calculate the percentage of this token's value relative to the total portfolio
        const percentageOfPortfolio = totalPortfolioValue > 0 ? (tokenPriceInUsd / totalPortfolioValue) * 100 : 0;
        return (
          <TokenInlinePreviewCard
            key={`token-item-${index}`}
            totalInUsd={`${tokenPriceInUsd.toFixed(2)}`} // Format to 2 decimal places
            img={item.image}
            percent={percentageOfPortfolio}
            title={item.name}
            symbol={item.symbol}
            onClick={() => {
              setTokenSymbolDetails(item.symbol);
            }}
          />
        );
      })}
      <TokenDetailsSheet
        open={!!tokenSymbolDetails}
        setOpen={(isSheetOpen) => {
          if (!isSheetOpen) setTokenSymbolDetails('');
        }}
        tokenSymbol={tokenSymbolDetails}
      />
    </div>
  );
};

export default PortfolioList;
