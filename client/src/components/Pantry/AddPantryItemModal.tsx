import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddPantryItem } from '../../hooks/useCulinary';
import { X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type AddPantryItemModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Spices', 'Other'];

export function AddPantryItemModal({ isOpen, onClose }: AddPantryItemModalProps) {
    const { mutate: addItem, isPending } = useAddPantryItem();
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        category: 'Produce',
        expiry: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addItem({
            name: formData.name,
            quantity: formData.quantity,
            category: formData.category as any, // Cast to match backend type for now
            expiry: formData.expiry || '1 week', // Default if empty
            color: 'bg-green-100', // Default color, ideally implied by category
        }, {
            onSuccess: () => {
                onClose();
                setFormData({ name: '', quantity: '', category: 'Produce', expiry: '' });
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
                        className="fixed inset-0 m-auto w-full max-w-md h-fit z-50 p-4"
                    >
                        <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/20">
                                <h2 className="text-lg font-bold">Add to Pantry</h2>
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="size-5 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Item Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Avion Avocados"
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Quantity</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. 5 pcs"
                                            value={formData.quantity}
                                            onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                        >
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Expiry</label>
                                    <input
                                        type="date"
                                        placeholder="Select date"
                                        value={formData.expiry}
                                        onChange={e => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className={cn(
                                            "w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                                            isPending && "opacity-70 cursor-not-allowed"
                                        )}
                                    >
                                        {isPending ? <Loader2 className="animate-spin size-5" /> : 'Add Ingredient'}
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
