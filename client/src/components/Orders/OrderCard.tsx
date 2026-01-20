import type { Order } from '../../types/order';
import { Clock, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface OrderCardProps {
    order: Order;
    onStatusChange: (id: string, status: Order['status']) => void;
    onDelete: (id: string) => void;
}

const OrderCard = ({ order, onStatusChange, onDelete }: OrderCardProps) => {
    const statusColors = {
        'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
        'completed': 'bg-green-100 text-green-800 border-green-200'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">{order.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                    {order.status.replace('-', ' ').toUpperCase()}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {order.specifications || "No specific instructions."}
            </p>

            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(order.startTime), 'MMM d, h:mm a')}
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {order.duration} mins
                </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => onDelete(order._id)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                    Delete
                </button>

                {order.status !== 'completed' ? (
                    <button
                        onClick={() => onStatusChange(order._id, 'completed')}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                        <CheckCircle size={16} /> Mark Done
                    </button>
                ) : (
                    <span className="text-gray-400 text-sm italic">Finished</span>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
