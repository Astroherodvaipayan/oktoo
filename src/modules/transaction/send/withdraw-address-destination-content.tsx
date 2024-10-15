import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetFooter } from '@/components/ui/sheet';

const WithdrawAddressDestinationContent = ({
  onPressNext,
  isSending,
  maxDestinationLength = 15,
  destinationPlaceholder = '💲💲💲💲💲💲',
}: {
  isSending: boolean;
  onPressNext: (value: string) => void;
  maxDestinationLength: number;
  destinationPlaceholder: string;
}) => {
  const [destination, setDestination] = useState('');

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  return (
    <>
      <div className="w-full mt-4 flex flex-col justify-center items-center align-center">
        <label htmlFor="to" className="text-sm font-medium">
          Destination Address: Put here the destination address
        </label>
        <Input
          id="to"
          value={destination}
          onChange={handleDestinationChange}
          placeholder={destinationPlaceholder}
          className="text-2xl font-semibold mt-2"
          maxLength={maxDestinationLength}
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
          {isSending ? 'Withdrawing...' : '🤑 Withdraw now!'}
        </Button>
      </SheetFooter>
    </>
  );
};

export default WithdrawAddressDestinationContent;
