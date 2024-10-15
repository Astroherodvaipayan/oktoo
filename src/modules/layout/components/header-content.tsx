import { Button } from '@/components/ui/button';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import Link from 'next/link';
import { useState } from 'react';
import AuthSheetOptions from './auth-sheet-options';

const HeaderContent = () => {
  const { user } = useAuthenticationStore();
  const [authSheetOpen, setAuthSheetOpen] = useState(false);
  return (
    <header className="gap-8 bg-background pl-4 md:px-4 flex items-center justify-between h-16 max-w-full w-2xl">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <div className="flex flex-row items-center gap-2 text-center justify-center">
          <img className="h-5 w-5" src="/logo.webp" />
          <h1 className="text-primary text-lg text-center font-bold hover:underline">emoji pay</h1>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setAuthSheetOpen(true);
          }}
        >
          <div className="flex flex-col">
            <span>
              <b>Logged in as </b>
              {user?.emojis}
            </span>
          </div>
        </Button>
        <AuthSheetOptions open={authSheetOpen} setOpen={setAuthSheetOpen} />
      </div>
    </header>
  );
};

export default HeaderContent;
