'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthenticationStore } from '@/utils/auth-store';
import { useOkto } from 'okto-sdk-react';
import { CoinPicker } from './coin-picker';
import { useEffect, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Wallet } from '@prisma/client';

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const EmojiSheet = ({
  onEmojiClick,
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (newValue: boolean) => void;
  onEmojiClick: (emoji: EmojiClickData) => void;
}) => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const EmojiPickerContent = (
    <EmojiPicker
      theme={'dark' as any}
      skinTonesDisabled
      autoFocusSearch
      previewConfig={{ showPreview: false }}
      width="100%"
      height={window.innerHeight / 2 ? 500 : window.innerHeight / 2}
      onEmojiClick={onEmojiClick}
    />
  );
  // if (windowDimensions.width > 1200) {
  //   return (
  //     <Popover open={open} onOpenChange={onOpenChange}>
  //       <PopoverContent className="w-80 p-0">{EmojiPickerContent}</PopoverContent>
  //     </Popover>
  //   );
  // }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-[#222]">
        {EmojiPickerContent}
      </SheetContent>
    </Sheet>
  );
};

const SendTokens = () => {
  const { wallets } = useAuthenticationStore();
  const [selectedWallet, setSelectedWallet] = useState(wallets?.[0]?.address || '');
  const [destination, setDestination] = useState(''); // Created state for the input of destination
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [amount, setAmount] = useState(undefined);
  const [isSending, setIsSending] = useState(false); // Added loading state
  const { getSupportedTokens, transferTokensWithJobStatus } = useOkto();

  useEffect(() => {
    if (wallets?.[0]?.address && !selectedWallet) {
      setSelectedWallet(wallets[0].address);
    }
  }, [wallets, selectedWallet]);

  const handleWalletChange = (wallet) => {
    setSelectedWallet(wallet);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTransferTokens = async () => {
    setIsSending(true); // Set loading state
    const foundWallet = wallets.find((w) => w.address === selectedWallet);
    let destionationWallet: Wallet = null;
    try {
      const response = await fetch(
        `/api/tx/prepare?destEmojis=${destination}&destNetwork=${foundWallet.network_name}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        toast.error('Destionation user wallet not found', {
          duration: 5000,
          description: 'There might be an issue with the destionation wallet',
        });
        setIsSending(false); // Reset loading state
        return;
      } else {
        const responseData = await response.json();
        if (responseData?.data) {
          destionationWallet = responseData?.data;
        }
      }
    } catch (error) {
      toast.error('Error sending money', {
        duration: 5000,
        description: `Failed with reason ${error.message}`,
      });
      setIsSending(false); // Reset loading state
      return;
    }

    const supportedTokens = await getSupportedTokens();
    const transferTokenAdd = supportedTokens.tokens.find((t) => t.network_name === destionationWallet.network_name);
    if (!transferTokenAdd) {
      toast.error(`Destination token address not found`);
      setIsSending(false); // Reset loading state
      return;
    }
    try {
      const transferData = {
        network_name: destionationWallet.network_name,
        token_address: transferTokenAdd.token_address, //destionationWallet.address,
        quantity: amount.toString(),
        recipient_address: destionationWallet.address,
      };
      const response = await transferTokensWithJobStatus(transferData);
      console.log(response);
      if (response.order_id) {
        toast.success('Tokens transferred successfully!');
      } else {
        toast.error(`Failed to transfer tokens`);
      }
    } catch (error) {
      toast.error(`Failed to transfer tokens: ${error.message}`);
    }
    setIsSending(false); // Reset loading state
  };

  return (
    <div id="send" className="max-w-6xl mx-auto flex-1 flex items-center align-center justify-center flex mt-4">
      <div className="bg-muted sm:rounded-xl shadow-lg p-4 md:p-6">
        <h1 className="text-2xl">💸 Send now!</h1>
        <div className="grid gap-6 mt-4">
          <div className="grid gap-2">
            <div className="flex items-center flex-col md:flex-row justify-between">
              <label
                htmlFor="from"
                className="text-md sm:text-lg text-start w-full font-medium sm:min-w-[40%] self-end"
              >
                🤑 How much?
              </label>
              <div className="flex items-center gap-2">
                <CoinPicker selectedWallet={selectedWallet} onValueChange={handleWalletChange} />
              </div>
            </div>
            <Input
              id="from"
              type="number"
              min={0}
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.0"
              className="text-2xl font-semibold"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="to" className="text-sm font-medium">
                Destination: Put here the destination emojis.
              </label>
            </div>

            <div className="relative">
              <Input
                id="to"
                value={destination}
                onChange={handleDestinationChange}
                placeholder="💲💲💲💲💲💲"
                className="text-2xl font-semibold"
                maxLength={15}
              />
              <Button
                variant="ghost"
                className="absolute right-0 top-0 rounded-lg"
                onClick={() => {
                  setEmojiPickerOpen(true);
                }}
              >
                🙂
              </Button>
            </div>
          </div>
          <Button
            className="w-full"
            disabled={!destination.length || !selectedWallet || !amount || isSending} // Disable button when sending
            onClick={handleTransferTokens}
          >
            {isSending ? 'Sending...' : '🏌️ Send now!'}
          </Button>
        </div>
      </div>
      <EmojiSheet
        open={emojiPickerOpen}
        onOpenChange={setEmojiPickerOpen}
        onEmojiClick={(emoji) => {
          setDestination((value) => {
            if (value.length < 15) {
              return value + emoji.emoji;
            }
            return value;
          });
        }}
      />
    </div>
  );
};

export default SendTokens;
