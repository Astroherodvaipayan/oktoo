import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetFooter } from '@/components/ui/sheet';

const EmojiDestinationContent = ({
  onPressNext,
  isSending,
}: {
  isSending: boolean;
  onPressNext: (value: string) => void;
}) => {
  const [destination, setDestination] = useState('');

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  return (
    <>
      <div className="w-full mt-4 flex flex-col justify-center items-center align-center">
        <label htmlFor="to" className="text-sm font-medium">
          Destination: Put here the destination emojis.
        </label>
        <Input
          id="to"
          value={destination}
          onChange={handleDestinationChange}
          placeholder="💲💲💲💲💲💲"
          className="text-2xl font-semibold mt-2"
          maxLength={15}
          disabled={isSending}
        />
      </div>
      <SheetFooter className="mt-8">
        <Button
          className="w-full"
          onClick={() => {
            onPressNext(destination);
          }}
          disabled={!destination || isSending}
        >
          {isSending ? 'Sending...' : '🏌️ Send now!'}
        </Button>
      </SheetFooter>
    </>
  );
};

export default EmojiDestinationContent;
