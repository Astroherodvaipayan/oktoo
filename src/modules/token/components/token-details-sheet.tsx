import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InteractiveSheetProperties } from '@/modules/general/types';
import TokenSummaryCard from './token-summary-card';
import { getTokenPrice } from '../hooks/get-total-porfolio-value';
import { useTokenValuesManagement } from '../store/token-values-management';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { getTokensList } from '../utils';
import TokenDetailsSheetHeader from './token-details-sheet-header';

const tokens = getTokensList(process.env.NEXT_PUBLIC_ENV);

const TokenDetailsSheet = ({ open, setOpen, tokenSymbol }: InteractiveSheetProperties & { tokenSymbol: string }) => {
  const { portfolio } = useAuthenticationStore();
  const tokenValues = useTokenValuesManagement();
  const portfolioItem = portfolio.find((p) => p.token_name.toLowerCase() === tokenSymbol?.toLowerCase());
  const tokenPriceInUsd = portfolioItem ? getTokenPrice(portfolioItem, tokenValues) : 0;
  const tokenDetails = tokens.find((t) => t.symbol.toLowerCase() === tokenSymbol?.toLowerCase());
  const balance = `${portfolioItem?.quantity} ${tokenSymbol}`;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto">
        <TokenDetailsSheetHeader tokenDetails={tokenDetails} />

        <div className="w-full mt-4 flex flex-col">
          <TokenSummaryCard
            subTitle="Balance"
            balance={balance}
            tokenSymbol={tokenSymbol}
            bottomParagraph={`$${tokenPriceInUsd?.toFixed(2)} USD`}
          />
        </div>
        <h1 className="px-4 text-xl mt-12">About {tokenDetails?.name}</h1>
        <p className="text-zinc-400 px-4">{tokenDetails?.description}</p>
      </SheetContent>
    </Sheet>
  );
};

export default TokenDetailsSheet;
