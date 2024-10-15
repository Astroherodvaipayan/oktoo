import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InteractiveSheetProperties } from '@/modules/general/types';
import TokenDetailsSheetHeader from '@/modules/token/components/token-details-sheet-header';
import { getSolanaNetworkName, getTokensList } from '@/modules/token/utils';
import DepositQrCode from './deposit-qr-code';
import { Button } from '@/components/ui/button';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { toast } from 'sonner';

const tokens = getTokensList(process.env.NEXT_PUBLIC_ENV);
interface InfoCardProps {
  title: string;
  description: string;
  hideCopy?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, hideCopy }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(description)
      .then(() => {
        toast.success(`${title} copied to clipboard!`);
      })
      .catch((error) => {
        toast.error('Failed to copy text');
        console.error('Copy failed:', error);
      });
  };
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-col flex-1">
        <b>{title}</b>
        <span className="text-zinc-400 break-all">{description}</span>
      </div>
      {!hideCopy && (
        <Button variant="outline" onClick={handleCopy}>
          Copy
        </Button>
      )}
    </div>
  );
};

const DepositSheet = ({ open, setOpen, tokenSymbol }: InteractiveSheetProperties & { tokenSymbol: string }) => {
  const tokenDetails = tokens.find((t) => t.symbol.toLowerCase() === tokenSymbol?.toLowerCase());
  const { wallets } = useAuthenticationStore();
  //const lol = wallets.find(item => item)
  const walletAddress = getSolanaNetworkName(process.env.NEXT_PUBLIC_ENV);
  const address = wallets?.find?.((w) => w.network_name === walletAddress);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto w-full">
        <TokenDetailsSheetHeader tokenDetails={tokenDetails} />
        <div className="flex mt-4 justify-center w-full">
          <div className="h-64 w-64">
            <DepositQrCode />
          </div>
        </div>
        <div className="w-full mt-4 flex flex-col px-4 gap-4">
          <InfoCard description={address?.network_name} title="Network" />
          <InfoCard description={address?.address || 'Unknown'} title="Address" />
          <InfoCard description={'Limitless'} title="Deposit Limit" hideCopy />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DepositSheet;
