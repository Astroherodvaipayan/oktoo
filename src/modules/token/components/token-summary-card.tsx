import { Button } from '@/components/ui/button';
import RequestTokenSheet from '@/modules/transaction/request/request-token-sheet';
import { useState, useCallback } from 'react';
import AllTokensSheet from './all-tokens-sheet';
import DepositSheet from '@/modules/transaction/deposit/deposit-sheet';
import SendTokenSheet from '@/modules/transaction/send/send-token-sheet';
import WithdrawTokenSheet from '@/modules/transaction/send/withdraw-token-sheet';

const ActionButton = ({ title, emoji, onClick }: { title: string; emoji: string; onClick: () => void }) => {
  return (
    <div>
      <Button onClick={onClick} variant="ghost" className="flex flex-col p-4 min-h-24 aspect-square">
        <span className="text-2xl md:text-4xl">{emoji}</span>
        <span className="md:text-lg">{title}</span>
      </Button>
    </div>
  );
};

const TokenSummaryCard = ({
  balance,
  subTitle,
  tokenSymbol: propTokenSymbol,
  bottomParagraph,
}: {
  subTitle?: string;
  balance: string;
  tokenSymbol?: string;
  bottomParagraph?: string;
}) => {
  const [currentTokenAction, setCurrentTokenAction] = useState('');
  const [selectedTokenSymbolFromList, setSelectedTokenSymbolFromList] = useState('');

  const currentTokenSymbol = propTokenSymbol || selectedTokenSymbolFromList;
  const hasInitialTokenSymbolProvided = !!propTokenSymbol;

  const handleActionButtonClick = useCallback((action: string) => {
    setCurrentTokenAction(action);
  }, []);

  const closeAllSheets = useCallback(() => {
    setCurrentTokenAction('');
    setSelectedTokenSymbolFromList('');
  }, []);

  const handleTokenSelect = useCallback(
    (tokenSymbol: string) => {
      setSelectedTokenSymbolFromList(tokenSymbol);
      //closeAllSheets(); // Close all sheets after selecting a token
    },
    [closeAllSheets],
  );

  return (
    <div className="w-full gap-2 text-center flex items-center flex-col">
      <div className="text-zinc-400 text-lg">{subTitle || 'Account Balance'}</div>
      <div className="text-4xl md:text-6xl">{balance}</div>
      {!!bottomParagraph && <div className="text-zinc-400 text-lg">{bottomParagraph}</div>}
      <div className="flex flex-row mt-2 md:mt-4 md:gap-2">
        <ActionButton title="Deposit" emoji="📲" onClick={() => handleActionButtonClick('deposit')} />
        <ActionButton title="Send" emoji="🏌️" onClick={() => handleActionButtonClick('send')} />
        <ActionButton title="Withdraw" emoji="🤑" onClick={() => handleActionButtonClick('withdraw')} />
        <ActionButton title="Request" emoji="😇" onClick={() => handleActionButtonClick('request')} />
      </div>

      {/* Modals and Sheets */}
      <AllTokensSheet
        open={!!currentTokenAction && !currentTokenSymbol && currentTokenAction !== 'request'}
        setOpen={(open) => {
          if (!open) closeAllSheets(); // Close all sheets when AllTokensSheet is closed
        }}
        onSelectToken={handleTokenSelect} // Use handleTokenSelect to manage token selection
      />
      <RequestTokenSheet
        open={currentTokenAction === 'request'}
        setOpen={(open) => (open ? setCurrentTokenAction('request') : closeAllSheets())}
      />
      <WithdrawTokenSheet
        tokenSymbol={currentTokenSymbol}
        open={currentTokenAction === 'withdraw' && !!currentTokenSymbol}
        setOpen={(open) => {
          if (!open) closeAllSheets();
        }}
        onSuccessTransfer={() => {
          closeAllSheets();
        }}
      />
      <SendTokenSheet
        tokenSymbol={currentTokenSymbol}
        open={currentTokenAction === 'send' && !!currentTokenSymbol}
        setOpen={(open) => {
          if (!open) closeAllSheets();
        }}
        onSuccessTransfer={() => {
          closeAllSheets();
        }}
      />
      <DepositSheet
        open={currentTokenAction === 'deposit' && !!currentTokenSymbol}
        setOpen={(newValue) => {
          if (!newValue) closeAllSheets();
        }}
        tokenSymbol={currentTokenSymbol}
      />
    </div>
  );
};

export default TokenSummaryCard;
