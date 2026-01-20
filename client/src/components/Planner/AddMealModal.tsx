import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecipes } from '../../hooks/useCulinary';
import { X, Search, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type Meal = {
    id: string;
    description: string;
    day: string;
    color: string;
    recipeId: string;
};

type AddMealModalProps = {
    isOpen: boolean;
    onClose: () => void;
    day: string;
    onAdd: (recipeId: string, description: string, color: string) => void;
    initialData?: Meal | null;
    onEdit?: (id: string, recipeId: string, description: string, color: string) => void;
    onDelete?: (id: string) => void;
};

// Pastel colors for meal cards
const MEAL_COLORS = [
    'bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-900/80 dark:border-orange-700 dark:text-orange-50',
    'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/80 dark:border-blue-700 dark:text-blue-50',
    'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/80 dark:border-green-700 dark:text-green-50',
    'bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-900/80 dark:border-purple-700 dark:text-purple-50',
    'bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-900/80 dark:border-pink-700 dark:text-pink-50',
    'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/80 dark:border-yellow-700 dark:text-yellow-50',
];

export function AddMealModal({ isOpen, onClose, day, onAdd, initialData, onEdit, onDelete }: AddMealModalProps) {
    const { data: recipes } = useRecipes();
    const [search, setSearch] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
    const [customDescription, setCustomDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(MEAL_COLORS[0]);

    useEffect(() => {
        if (isOpen && initialData) {
            setSearch(initialData.description);
            setCustomDescription(initialData.description);
            setSelectedColor(initialData.color);
            // Try to find recipe if it matches
            if (recipes && initialData.recipeId && !initialData.recipeId.startsWith('custom-')) {
                const found = recipes.find(r => r.id === initialData.recipeId || r._id === initialData.recipeId);
                if (found) setSelectedRecipe(found);
            }
        } else if (isOpen && !initialData) {
            // Reset for new add
            setSearch('');
            setCustomDescription('');
            setSelectedRecipe(null);
            setSelectedColor(MEAL_COLORS[0]);
        }
    }, [isOpen, initialData, recipes]);

    const filteredRecipes = recipes?.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const description = selectedRecipe ? selectedRecipe.title : customDescription;
        const recipeId = selectedRecipe ? (selectedRecipe._id || selectedRecipe.id) : `custom-${Date.now()}`;

        if (!description) return;

        if (initialData && onEdit) {
            onEdit(initialData.id, recipeId, description, selectedColor);
        } else {
            onAdd(recipeId, description, selectedColor);
        }
        handleClose();
    };

    const handleDelete = () => {
        if (initialData && onDelete) {
            if (window.confirm("Are you sure you want to delete this meal?")) {
                onDelete(initialData.id);
                handleClose();
            }
        }
    };

    const handleClose = () => {
        setSearch('');
        setSelectedRecipe(null);
        setCustomDescription('');
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-lg h-[fit-content] max-h-[90vh] z-50 p-4"
                    >
                        <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full">
                            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-secondary/10">
                                <h2 className="text-xl font-bold">
                                    {initialData ? 'Edit Meal' : `Add Meal for`} <span className="text-primary">{!initialData && day}</span>
                                </h2>
                                <button onClick={handleClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="size-5 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Recipe Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Select Recipe or Custom Meal</label>

                                    {/* Search / Toggle */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <input
                                            placeholder="Search recipes..."
                                            value={search}
                                            onChange={e => {
                                                setSearch(e.target.value);
                                                if (selectedRecipe) setSelectedRecipe(null);
                                                setCustomDescription(e.target.value);
                                            }}
                                            className="w-full pl-9 bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>

                                    {/* Recipe Suggestions */}
                                    {search && filteredRecipes.length > 0 && !selectedRecipe && (
                                        <div className="max-h-40 overflow-y-auto border border-border rounded-xl bg-background shadow-lg">
                                            {filteredRecipes.map(recipe => (
                                                <button
                                                    key={recipe._id || recipe.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedRecipe(recipe);
                                                        setSearch(recipe.title);
                                                        setCustomDescription('');
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors flex items-center gap-2"
                                                >
                                                    <div className="size-8 rounded-md bg-muted overflow-hidden shrink-0">
                                                        <img src={recipe.image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="truncate text-sm font-medium">{recipe.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Color Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Card Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {MEAL_COLORS.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={cn(
                                                    "size-8 rounded-full border-2 transition-all",
                                                    color.split(' ')[0], // bg class
                                                    selectedColor === color ? "border-primary scale-110 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    {initialData && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="px-4 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors mr-auto"
                                            title="Delete Meal"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 py-3 rounded-xl border border-border font-medium hover:bg-muted/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!customDescription && !selectedRecipe}
                                        className={cn(
                                            "flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                                            (!customDescription && !selectedRecipe) && "opacity-70 cursor-not-allowed"
                                        )}
                                    >
                                        {initialData ? 'Save Changes' : 'Add to Plan'}
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
