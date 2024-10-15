import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { GlobalAppToken } from '@/modules/general/types';

const TokenDetailsSheetHeader = ({ tokenDetails }: { tokenDetails: GlobalAppToken }) => {
  return (
    <SheetHeader className="flex flex-row gap-4">
      <div>
        <img src={tokenDetails?.image} className="h-8 w-8 mt-3 rounded-full" />
      </div>
      <div className="flex-1 flex flex-col">
        <SheetTitle>{tokenDetails?.name}</SheetTitle>
        <SheetDescription>{tokenDetails?.symbol}</SheetDescription>
      </div>
    </SheetHeader>
  );
};

export default TokenDetailsSheetHeader;
