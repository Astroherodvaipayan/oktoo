import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import Link from 'next/link';

const AuthSheetOptions = ({ open, setOpen }: { open: boolean; setOpen: (newValue: boolean) => void }) => {
  const { removeInformation } = useAuthenticationStore();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="bg-[#222] mx-auto">
        <SheetHeader>
          <SheetTitle>Profile actions</SheetTitle>
        </SheetHeader>
        <div className="w-full mt-4 flex flex-col">
          <Link href="https://x.com/emojipayit" target="_blank">
            <Button variant="outline" className="w-full">
              🛠️ Contact support
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => {
              removeInformation();
              window.location.href = '/';
              setOpen(false);
            }}
          >
            ⇲ Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuthSheetOptions;
