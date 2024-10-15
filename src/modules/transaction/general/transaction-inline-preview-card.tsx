import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { getTokensList } from '@/modules/token/utils';
import { Transaction, User } from '@prisma/client';

const tokens = getTokensList(process.env.NEXT_PUBLIC_ENV!);
const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second'); // 'few seconds ago'
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute'); // '5 minutes ago'
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour'); // '3 hours ago'
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day'); // '9 days ago'
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month'); // '2 months ago'
  }
  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year'); // '1 year ago'
};

const TransactionInlinePreviewCard = ({ transaction }: { transaction: Transaction & { from: User; to: User } }) => {
  const { from, to, amount, totalInDollars, creationDate, type, withdrawDestinationAddress } = transaction;
  const { user } = useAuthenticationStore();

  // Format creation date to a more readable format (e.g., 9 days ago)
  const date = new Date(creationDate);

  // Determine if the current user is the sender or receiver
  const isSender = user.id === from.id;

  const foundToken = tokens.find((t) => t.symbol.toLowerCase() === transaction.tokenSymbol.toLowerCase());
  let message: string;
  if (type === 'withdraw') {
    // Handle withdrawal case
    message = `You withdrew ${amount} ${foundToken?.symbol} to ${withdrawDestinationAddress}`;
  } else {
    // Handle regular transfer case
    message = isSender
      ? `You(${user.emojis}) sent ${amount} ${foundToken?.symbol} to ${to.emojis}`
      : `${to.emojis} received ${amount} ${foundToken?.symbol} from You(${user.emojis})`;
  }

  const relativeTime = getRelativeTime(date);
  return (
    <div className="w-full rounded-xl hover:bg-accent cursor-pointer flex flex-row gap-2 px-4 py-4">
      <div>
        <img src={foundToken?.image} className="rounded-full w-5 h-5 pt-0.5" />
      </div>
      <div className="flex-1">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex-1 text-sm break-all">{message}</div>
          <div className="flex row gap-2 text-zinc-400  self-start">
            <div className="text-sm">{relativeTime}</div>
          </div>
        </div>
        <div className="flex-1 text-sm text-zinc-400">{`${totalInDollars} USD`}</div>
      </div>
    </div>
  );
};

export default TransactionInlinePreviewCard;
