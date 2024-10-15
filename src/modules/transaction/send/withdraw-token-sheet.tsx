import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InteractiveSheetProperties } from '@/modules/general/types';
import TokenAmountContent from './token-amount-content';
import { useOkto, Wallet } from 'okto-sdk-react';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getSolanaNetworkName, getTokensList } from '@/modules/token/utils';
import { getTokenPrice } from '@/modules/token/hooks/get-total-porfolio-value';
import { useTokenValuesManagement } from '@/modules/token/store/token-values-management';
import WithdrawAddressDestinationContent from './withdraw-address-destination-content';

const WithdrawTokenSheet = ({
  open,
  setOpen,
  tokenSymbol,
  onSuccessTransfer,
}: InteractiveSheetProperties & { tokenSymbol: string; onSuccessTransfer: () => void }) => {
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { getSupportedTokens, transferTokens } = useOkto();
  const { user, portfolio } = useAuthenticationStore();
  const tokensValues = useTokenValuesManagement();

  const handleTokenSent = async (destination: string) => {
    setIsSending(true);
    try {
      const supportedTokens = await getSupportedTokens();
      console.log('Supported tokens:', supportedTokens);
      const transferTokenAdd = supportedTokens.tokens.find(
        (t) => t.network_name === getSolanaNetworkName(process.env.NEXT_PUBLIC_ENV),
      );
      console.log({ transferTokenAdd });
      console.log({ transferTokenAdd });

      console.log('Transfer token address:', transferTokenAdd);
      if (!transferTokenAdd) {
        toast.error(`Destination token address not found`);
        setIsSending(false);
        return;
      }
      const transferData = {
        network_name: getSolanaNetworkName(process.env.NEXT_PUBLIC_ENV),
        token_address: transferTokenAdd.token_address,
        quantity: amount.toString(),
        recipient_address: destination,
      };

      console.log('Transfer data:', transferData);
      const response = await transferTokens(transferData);

      console.log('Transfer response:', response);
      const foundToken = portfolio.find((t) => t.token_name.toLowerCase() === tokenSymbol.toLowerCase());
      let totalInDollars = 0;
      let tokenInUsd = !foundToken ? 0 : getTokenPrice(foundToken, tokensValues);
      try {
        totalInDollars = parseFloat(amount) * tokenInUsd;
      } catch (error) {
        totalInDollars = 0;
      }

      const transactionToInsert = {
        orderId: response.orderId,
        fromUserId: user.id,
        toUserId: user.id,
        amount,
        network_name: transferTokenAdd.network_name,
        totalInDollars,
        tokenInDollar: tokenInUsd,
        oktoUserId: user.oktoUserId,
        tokenSymbol,
        type: 'withdraw',
        withdrawDestinationAddress: destination,
      };
      if (response.orderId) {
        try {
          const postResponse = await fetch('/api/tx/success-transfer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionToInsert),
          });

          const result = await postResponse.json();

          if (postResponse.ok) {
            toast.success('Tokens transferred and transaction saved successfully!');
            onSuccessTransfer();
          } else {
            console.error('Failed to save transaction:', result);
            toast.error(`Failed to save transaction: ${result.error}`);
          }
        } catch (error) {
          console.error('Error saving transaction:', error);
          toast.error(`Failed to save transaction: ${error.message}`);
        }
      } else {
        toast.error('Failed to transfer tokens');
      }
    } catch (error) {
      toast.error(`Failed to transfer tokens: ${error.message}`);
    }
    setIsSending(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(newValue) => {
        if (isSending) {
          return;
        }
        setOpen(newValue);
      }}
    >
      <SheetContent side="bottom" className="mx-auto">
        <SheetHeader className="flex items-center flex-row gap-2">
          {!!amount && (
            <Button
              variant="ghost"
              className="aspect-square px-2"
              onClick={() => {
                setAmount('');
              }}
            >
              <ArrowLeft />
            </Button>
          )}
          <SheetTitle>🤑 Withdraw</SheetTitle>
        </SheetHeader>
        {!amount ? (
          <TokenAmountContent
            onPressNext={setAmount}
            initialValue={amount}
            submitText={'Next: Choose destination wallet'}
          />
        ) : (
          <WithdrawAddressDestinationContent
            onPressNext={handleTokenSent}
            isSending={isSending}
            maxDestinationLength={150}
            destinationPlaceholder="0x..."
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WithdrawTokenSheet;
