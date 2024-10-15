import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const RequestTokenSheet = ({ open, setOpen }: { open: boolean; setOpen: (newValue: boolean) => void }) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto">
        <SheetHeader>
          <SheetTitle>😇 Request</SheetTitle>
        </SheetHeader>
        <div className="w-full mt-4 flex flex-col">This feature is not available yet...</div>
      </SheetContent>
    </Sheet>
  );
};

export default RequestTokenSheet;
