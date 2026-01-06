import { usePantry } from '../../hooks/useCulinary';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AddPantryItemModal } from './AddPantryItemModal';
import { EditPantryItemModal } from './EditPantryItemModal';
import { formatDate } from '../../lib/utils';

export function PantryView() {
    const { data: pantryItems, isLoading } = usePantry();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    if (isLoading) return <div className="p-10 text-center animate-pulse flex flex-col items-center gap-4"><div className="size-12 rounded-full bg-muted animate-pulse" /><div className="h-4 w-32 bg-muted rounded-full" /></div>;

    const items = pantryItems || [];

    const categories = [
        { name: 'Produce', icon: '🥬' },
        { name: 'Protein', icon: '🍗' },
        { name: 'Dairy', icon: '🧀' },
        { name: 'Pantry', icon: '🥫' },
        { name: 'Spices', icon: '🌶️' },
    ];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            {/* Header with Stats, Search, and Filters */}
            <div className="mb-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            className="text-green-600 dark:text-green-400"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-open"><path d="M12 22v-9" /><path d="m22 7-10-5-10 5" /><path d="m22 20-10 5-10-5" /><path d="M22 17v-3" /><path d="m16.5 13-1.5 8" /><path d="M7 16.5 12 22" /></svg>
                        </motion.div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Your Pantry</h1>
                        <p className="text-muted-foreground font-medium">
                            <span className="text-primary">{filteredItems.length} active</span> of {pantryItems?.length || 0} ingredients
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <input
                            type="text"
                            placeholder="Search ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-card border border-border hover:bg-muted/50'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat.name ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-card border border-border hover:bg-muted/50'}`}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Add Button - Always first */}
                <motion.button
                    layout
                    onClick={() => setIsAddModalOpen(true)}
                    whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--muted)/0.8)" }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center p-4 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors h-[180px]"
                >
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-2 shadow-inner">
                        <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="font-medium">Add Item</span>
                </motion.button>

                {filteredItems.map((item, index) => (
                    <motion.div
                        key={item._id || item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                            delay: index * 0.05
                        }}
                        whileHover={{
                            scale: 1.05,
                            y: -5,
                            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingItem(item)}
                        className="bg-card border border-border/50 p-4 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/50 transition-colors cursor-pointer active:cursor-grabbing group relative overflow-hidden h-[180px]"
                    >
                        {/* Background Gradient Blob */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${item.color} opacity-20 blur-2xl rounded-full group-hover:opacity-30 transition-opacity`} />

                        <div className="flex justify-between items-start z-10 w-full">
                            <div className={`size-10 rounded-full ${item.color} flex items-center justify-center text-lg font-bold shadow-inner`}>
                                {item.name[0]}
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-secondary rounded-full text-secondary-foreground whitespace-nowrap">
                                {formatDate(item.expiry)}
                            </span>
                        </div>

                        <div className="z-10 mt-auto">
                            <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-1">{item.name}</h3>
                            <div className="flex justify-between items-end">
                                <p className="text-sm text-muted-foreground">{item.quantity}</p>
                                <p className="text-[10px] items-center flex gap-1 uppercase tracking-wider font-bold text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded-md">
                                    {item.category}
                                </p>
                            </div>
                        </div>

                        {/* Tactile Progress Bar (Fake freshness) */}
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-2">
                            <motion.div
                                className={`h-full ${item.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: "70%" }}
                                transition={{ duration: 1, delay: 0.2 }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            <AddPantryItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

            {editingItem && (
                <EditPantryItemModal
                    isOpen={!!editingItem}
                    onClose={() => setEditingItem(null)}
                    item={editingItem}
                />
            )}
        </>
    );
}
