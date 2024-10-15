import { Button } from '@/components/ui/button';
import TransactionInlinePreviewCard from '@/modules/transaction/general/transaction-inline-preview-card';
import TransactionListSheet from './transaction-list-sheet';
import { useState, useEffect } from 'react';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { Skeleton } from '@/components/ui/skeleton';
import OrderList from '@/modules/transaction/history/order-list';

const ItemListLoading = () => {
  return (
    <div className="w-full rounded-xl flex flex-row gap-2 px-4 py-4 items-center space-x-4">
      <div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full max-w-[300px]" />
      </div>
    </div>
  );
};
const TransactionListContent = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { saveActivityTransactions, user, activity } = useAuthenticationStore(); // Assuming userId is available here

  const handleSheetOpen = () => {
    setIsSheetOpen(true);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tx/all?oktoUserId=${user.oktoUserId}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      saveActivityTransactions(data.history);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 w-full">
      <h1 className="px-4 text-xl text-zinc-400">Activity</h1>

      {loading ? (
        <div className="w-full flex flex-col">
          {new Array(3).fill(0).map((_, index) => (
            <ItemListLoading key={`loading-item-${index}`} />
          ))}
        </div>
      ) : (
        <OrderList />
      )}

      <Button className="w-full" variant="outline" onClick={handleSheetOpen} disabled={loading}>
        👀 View all
      </Button>
      <TransactionListSheet open={isSheetOpen} setOpen={setIsSheetOpen} />
    </div>
  );
};

export default TransactionListContent;
