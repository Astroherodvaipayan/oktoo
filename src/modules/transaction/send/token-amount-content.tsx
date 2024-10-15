import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetFooter } from '@/components/ui/sheet';
import { DeleteIcon } from 'lucide-react';

const TokenAmountContent = ({
  onPressNext,
  initialValue,
  submitText,
}: {
  submitText?: string;
  initialValue: string;
  onPressNext: (value: string) => void;
}) => {
  const chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', <DeleteIcon />];
  const [inputValue, setInputValue] = useState(initialValue);

  // Helper function to format the number with commas
  const formatWithCommas = (value: string) => {
    // Separate the integer and decimal part if there's a dot
    const parts = value.split('.');
    const integerPart = parts[0].replace(/\D/g, ''); // Remove any non-numeric characters
    const formattedInteger = new Intl.NumberFormat('en-US').format(Number(integerPart));

    return parts.length > 1 ? `${formattedInteger}.${parts[1]}` : formattedInteger;
  };

  // Function to handle valid input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ''); // Remove commas to allow proper parsing
    if (/^\d*\.?\d*$/.test(value)) {
      const formattedValue = formatWithCommas(value);
      setInputValue(formattedValue);
    }
  };

  // Handle paste to ensure only valid characters (numbers and a single dot) are pasted
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedValue = e.clipboardData.getData('Text').replace(/,/g, '');
    if (!/^\d*\.?\d*$/.test(pastedValue)) {
      e.preventDefault();
    }
  };

  // Handle keyboard click interaction
  const handleKeyboardClick = (char: string | JSX.Element) => {
    if (typeof char === 'string') {
      if (char === '.' && inputValue.includes('.')) return; // Prevent multiple dots
      const newValue = inputValue + char;
      setInputValue(formatWithCommas(newValue.replace(/,/g, '')));
    } else {
      // Handle delete icon functionality
      const newValue = inputValue.slice(0, -1).replace(/,/g, '');
      setInputValue(formatWithCommas(newValue));
    }
  };

  return (
    <>
      <div className="w-full mt-4 flex flex-col justify-center items-center align-center">
        <Input
          className="text-center h-auto md:text-6xl text-4xl"
          value={inputValue}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder="0.00"
        />
        <div className="h-[50vh] max-w-[300px] mt-2 grid grid-cols-3 ">
          {chars.map((c, index) => (
            <div
              key={index}
              className="flex cursor-pointer rounded-xl hover:text-zinc-400 items-center justify-center aspect-square text-center hover:bg-primary/90"
              onClick={() => handleKeyboardClick(c)}
            >
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
      <SheetFooter>
        <Button
          className="w-full"
          onClick={() => {
            onPressNext(inputValue);
          }}
          disabled={!inputValue || parseInt(inputValue.replace('.', '0') || '') === 0}
        >
          {submitText || 'Next: Choose Destination Emoji'}
        </Button>
      </SheetFooter>
    </>
  );
};

export default TokenAmountContent;
