import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import OrderList from '../components/Orders/OrderList';
import AddOrderModal from '../components/Orders/AddOrderModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { getOrders, updateOrder, deleteOrder } from '../services/orderService';
import type { Order } from '../types/order';
import { toast } from 'sonner';

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            toast.error("Could not load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: string, status: Order['status']) => {
        try {
            await updateOrder(id, { status });
            toast.success("Order status updated");
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteClick = (id: string) => {
        setOrderToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;

        try {
            await deleteOrder(orderToDelete);
            toast.success("Order deleted");
            fetchOrders();
        } catch (error) {
            toast.error("Failed to delete order");
        } finally {
            setOrderToDelete(null);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Kitchen Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your cooking schedule and tasks.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                >
                    <Plus size={20} /> New Order
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <OrderList
                    orders={orders}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteClick}
                />
            )}

            <AddOrderModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onOrderAdded={fetchOrders}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Order?"
                message="Are you sure you want to delete this order? This action cannot be undone."
                confirmText="Delete Order"
            />
        </div>
    );
};

export default Orders;
