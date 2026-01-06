import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddRecipe } from '../../hooks/useCulinary';
import { Plus, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils'; // Keep if used, or remove if unused in new code. cn is used!

type AddRecipeModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type Ingredient = {
    name: string;
    amount: string;
};

export function AddRecipeModal({ isOpen, onClose }: AddRecipeModalProps) {
    const { mutate: addRecipe, isPending } = useAddRecipe();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [time, setTime] = useState('');
    const [calories, setCalories] = useState('');
    const [servings, setServings] = useState('');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
    const [tags, setTags] = useState(''); // Comma separated
    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation filtering out empty ingredients
        const filteredIngredients = ingredients.filter(i => i.name.trim() !== '');
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');

        addRecipe({
            title,
            description,
            image: image || undefined,
            time,
            calories: Number(calories),
            servings: Number(servings) || 2,
            difficulty,
            tags: tagArray,
            ingredients: filteredIngredients
        }, {
            onSuccess: () => {
                onClose();
                // Reset form
                setTitle('');
                setDescription('');
                setImage('');
                setTime('');
                setCalories('');
                setServings('');
                setDifficulty('Medium');
                setTags('');
                setIngredients([{ name: '', amount: '' }]);
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-2xl h-[fit-content] max-h-[90vh] z-50 p-4"
                    >
                        <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full">
                            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-secondary/10">
                                <h2 className="text-xl font-bold">Add New Recipe</h2>
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="size-5 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-medium">Recipe Title</label>
                                        <input
                                            required
                                            placeholder="e.g. Grandma's Apple Pie"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            placeholder="A short description of the dish..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm min-h-[80px]"
                                        />
                                    </div>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Time</label>
                                        <input
                                            required
                                            placeholder="e.g. 45 mins"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Calories</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="e.g. 500"
                                            value={calories}
                                            onChange={(e) => setCalories(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Servings</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="e.g. 4"
                                            value={servings}
                                            onChange={(e) => setServings(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Difficulty</label>
                                        <select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value as any)}
                                            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-sm appearance-none"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Image URL <span className="text-muted-foreground font-normal">(Optional)</span></label>
                                    <input
                                        placeholder="https://..."
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tags <span className="text-muted-foreground font-normal">(Comma separated)</span></label>
                                    <input
                                        placeholder="e.g. Healthy, Dinner, Quick"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium">Ingredients</label>
                                    </div>
                                    <div className="space-y-2 bg-muted/20 p-4 rounded-xl border border-border/40">
                                        {ingredients.map((ing, index) => (
                                            <div key={index} className="flex gap-2 items-start">
                                                <input
                                                    placeholder="Item name"
                                                    value={ing.name}
                                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                    required
                                                />
                                                <input
                                                    placeholder="Qty"
                                                    value={ing.amount}
                                                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                                    className="w-20 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                    required
                                                />
                                                {ingredients.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveIngredient(index)}
                                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddIngredient}
                                            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border-2 border-dashed border-primary/20 text-primary/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium mt-2"
                                        >
                                            <Plus className="size-3" /> Add Ingredient
                                        </button>
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
                                        disabled={isPending}
                                        className={cn(
                                            "flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                                            isPending && "opacity-70 cursor-not-allowed"
                                        )}
                                    >
                                        {isPending ? <Loader2 className="animate-spin size-5" /> : 'Create Recipe'}
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
