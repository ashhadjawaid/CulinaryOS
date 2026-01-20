import type { Order } from '../../types/order';
import OrderCard from './OrderCard';

interface OrderListProps {
    orders: Order[];
    onStatusChange: (id: string, status: Order['status']) => void;
    onDelete: (id: string) => void;
}

const OrderList = ({ orders, onStatusChange, onDelete }: OrderListProps) => {
    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">No active kitchen orders. Schedule one above!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
                <OrderCard
                    key={order._id}
                    order={order}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default OrderList;
