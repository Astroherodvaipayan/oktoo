import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import TransactionInlinePreviewCard from '../general/transaction-inline-preview-card';

const OrderList = () => {
  const { activity } = useAuthenticationStore();

  if (!activity?.length) return <p className="px-4 mb-4">No transactions done with this profile yet...</p>;

  return (
    <div>
      {activity.map((order) => {
        return <TransactionInlinePreviewCard transaction={order as any} />;
      })}
    </div>
  );
};

export default OrderList;
