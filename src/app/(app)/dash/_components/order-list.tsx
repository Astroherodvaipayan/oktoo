import { useOkto } from 'okto-sdk-react';
import { useEffect, useState } from 'react';
import { getIcon } from './coin-picker';

const OrderList = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const { orderHistory: getOrderHistory } = useOkto();

  const getOrders = async () => {
    const data = await getOrderHistory({ limit: 100 });
    setOrderHistory(data.jobs);
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (!orderHistory?.length) return <div>No orders related with this account yet...</div>;

  return (
    <div id="history">
      {orderHistory.map((order) => {
        return (
          <div className="flex flex-row gap-2" key={order.order_id}>
            <img src={getIcon(order.network_name)} className="mt-1 w-4 h-4" />
            <div>
              <h2>{order.network_name}</h2>
              <span>{order.transaction_hash}</span>
              <h2 className="text-zinc-400">
                {order.order_type} - {order.status}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
