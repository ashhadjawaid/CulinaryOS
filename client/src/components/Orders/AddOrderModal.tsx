import { useState } from 'react';
import { X, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { createOrder } from '../../services/orderService';
import { toast } from 'sonner';

interface AddOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderAdded: () => void;
}

const AddOrderModal = ({ isOpen, onClose, onOrderAdded }: AddOrderModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        specifications: '',
        startTime: '',
        endTime: '',
        duration: 0
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateDuration = (start: string, end: string) => {
        if (!start || !end) return 0;
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        if (isNaN(startTime) || isNaN(endTime)) return 0;
        // Logic to allow same-day orders or future orders
        return Math.floor((endTime - startTime) / 60000); // Minutes
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log('Form submission:', formData);
            const duration = calculateDuration(formData.startTime, formData.endTime);
            console.log('Calculated duration:', duration);

            if (duration <= 0) {
                // Check if it's just a matter of "end time is before start time"
                const start = new Date(formData.startTime);
                const end = new Date(formData.endTime);
                if (end <= start) {
                    console.warn('Validation failed: End time is before or equal to Start time');
                    toast.error("End time must be after start time");
                    setLoading(false);
                    return;
                }
                // If duration is 0 because of invalid date but logic passed? Unlikely.
            }

            await createOrder({ ...formData, duration });
            toast.success("Order scheduled successfully!");
            onOrderAdded();
            onClose();
        } catch (error) {
            toast.error("Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl m-4 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="text-orange-500" />
                        New Kitchen Order
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={20} className="dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g. Chocolate Cake for Birthday"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                <Clock size={14} /> Start Time
                            </label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                required
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                <Clock size={14} /> End Time
                            </label>
                            <input
                                type="datetime-local"
                                name="endTime"
                                required
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                            <FileText size={14} /> Specifications
                        </label>
                        <textarea
                            name="specifications"
                            rows={3}
                            placeholder="e.g. Less sugar, Gluten-free, Extra crispy"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Scheduling...' : 'Create Schedule'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddOrderModal;
