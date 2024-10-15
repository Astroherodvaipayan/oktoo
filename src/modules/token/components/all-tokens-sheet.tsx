import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InteractiveSheetProperties } from '@/modules/general/types';
import { getTokensList } from '../utils';

const allTokens = getTokensList(process.env.NEXT_PUBLIC_ENV!);
const AllTokensSheet = ({
  open,
  setOpen,
  onSelectToken,
}: InteractiveSheetProperties & { onSelectToken: (tokenSymbol: string) => void }) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto">
        <SheetHeader>
          <SheetTitle>🔍 Select a token to continue</SheetTitle>
        </SheetHeader>
        <div className="w-full mt-4 flex flex-col">
          {allTokens.map((item, index) => (
            <div
              key={`all-tokens-item-${index}`}
              className="w-full rounded-xl hover:bg-accent cursor-pointer flex flex-row gap-2 px-4 py-4"
              onClick={() => {
                onSelectToken(item.symbol);
              }}
            >
              <div className="">
                <img src={item.image} className="rounded-full w-5 h-5" />
              </div>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AllTokensSheet;
