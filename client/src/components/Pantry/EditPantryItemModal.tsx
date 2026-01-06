import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpdatePantryItem, useDeletePantryItem } from '../../hooks/useCulinary';
import { Trash2, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

type PantryItem = {
    _id: string;
    name: string;
    category: string;
    quantity: string;
    expiry: string;
    color: string;
};

type EditPantryItemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    item: PantryItem;
};

const CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Spices', 'Other'];
const COLORS = [
    { label: 'Green', value: 'bg-green-100 text-green-700' },
    { label: 'Blue', value: 'bg-blue-100 text-blue-700' },
    { label: 'Orange', value: 'bg-orange-100 text-orange-700' },
    { label: 'Red', value: 'bg-red-100 text-red-700' },
    { label: 'Yellow', value: 'bg-yellow-100 text-yellow-700' },
    { label: 'Purple', value: 'bg-purple-100 text-purple-700' },
    { label: 'Slate', value: 'bg-slate-100 text-slate-700' },
];

export function EditPantryItemModal({ isOpen, onClose, item }: EditPantryItemModalProps) {
    const { mutate: updateItem, isPending: isUpdating } = useUpdatePantryItem();
    const { mutate: deleteItem, isPending: isDeleting } = useDeletePantryItem();

    const [formData, setFormData] = useState({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        expiry: (() => {
            if (!item.expiry) return '';
            const date = new Date(item.expiry);
            return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
        })(),
        color: item.color
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateItem({ id: item._id, ...formData }, {
            onSuccess: () => onClose()
        });
    };

    const handleDelete = () => {
        toast("Are you sure you want to delete this item?", {
            action: {
                label: "Delete",
                onClick: () => {
                    const itemId = item._id || (item as any).id;
                    deleteItem(itemId, {
                        onSuccess: () => {
                            onClose();
                            toast.success("Item deleted");
                        }
                    });
                }
            },
            cancel: {
                label: "Cancel",
                onClick: () => { }
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-[fit-content] z-50 p-4"
                    >
                        <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-secondary/10">
                                <h2 className="text-xl font-bold">Edit Item</h2>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-full transition-colors mr-2"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? <Loader2 className="size-5 animate-spin" /> : <Trash2 className="size-5" />}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Item Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(value) => setFormData({ ...formData, category: value.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Quantity</label>
                                        <input
                                            required
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Expiry</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.expiry}
                                            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Color Tag</label>
                                        <select
                                            value={formData.color}
                                            onChange={(value) => setFormData({ ...formData, color: value.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                        >
                                            {COLORS.map((color) => (
                                                <option key={color.value} value={color.value}>
                                                    {color.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-3 rounded-xl border border-border font-medium hover:bg-muted/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className={cn(
                                            "flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                                            isUpdating && "opacity-70 cursor-not-allowed"
                                        )}
                                    >
                                        {isUpdating ? <Loader2 className="animate-spin size-5" /> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
