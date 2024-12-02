import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const NewRequestTokenSheet = ({ open, setOpen }: { open: boolean; setOpen: (newValue: boolean) => void }) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto">
        <SheetHeader>
          <SheetTitle>😇 New Token Request</SheetTitle>
        </SheetHeader>
        <div className="w-full space-y-4">
          <Input name="title" placeholder="Title" />
          <Input name="description" placeholder="Description" />
          <Input name="emojis-separated-by-comma" placeholder="Emojis (comma-separated)" />
          <Input name="ammount" placeholder="Amount" />
          <Button
            className="w-full"
            onClick={() => {
              setOpen(false);
            }}
          >
            Create
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export const ViewPortfolioSheet = ({ open, setOpen }: { open: boolean; setOpen: (newValue: boolean) => void }) => {
  const { user } = useAuthenticationStore();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto">
        <SheetHeader>
          <SheetTitle>💼 My assets</SheetTitle>
        </SheetHeader>
        <div className="w-full space-y-4 min-h-[60vh]">
          <div className="w-full gap-2 flex flex-row mt-4">
            <div>
              <img src="https://img.cryptorank.io/coins/base1682407673437.png" className="w-6 h-6 round-full" />
            </div>
            <div className="flex-1 flex flex-col">
              <b>{user.emojis}-oktopay.base.eth</b>
              <span className="text-zinc-400">Handlename by base to identify your account</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const RequestTokenSheet = ({ open, setOpen }: { open: boolean; setOpen: (newValue: boolean) => void }) => {
  const [isNewRequestTokenOpen, setIsNewRequestTokenOpen] = useState(false);

  const handleNewRequestOpen = () => {
    setIsNewRequestTokenOpen(true);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto">
        <SheetHeader>
          <SheetTitle>😇 Request</SheetTitle>
        </SheetHeader>
        <div className="w-full space-y-4 min-h-[60vh]">
          <Button onClick={handleNewRequestOpen} className="mt-4 text-white ">
            <PlusIcon /> Create new
          </Button>
        </div>

        <NewRequestTokenSheet setOpen={setIsNewRequestTokenOpen} open={isNewRequestTokenOpen} />
      </SheetContent>
    </Sheet>
  );
};

export default RequestTokenSheet;
