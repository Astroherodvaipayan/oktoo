import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import OrderList from '@/modules/transaction/history/order-list';

const TransactionListSheet = ({ open, setOpen }: { open: boolean; setOpen: (newValue: boolean) => void }) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto">
        <SheetHeader>
          <SheetTitle>Activity </SheetTitle>
        </SheetHeader>
        <div className="w-full mt-4 flex flex-col">
          <OrderList />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionListSheet;
