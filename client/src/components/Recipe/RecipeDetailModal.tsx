import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpdateRecipe, useDeleteRecipe } from '../../hooks/useCulinary';
import { Trash2, Edit2, Clock, Flame, BookOpen, X, Loader2, Plus } from 'lucide-react';

import { toast } from 'sonner';

type Recipe = {
    _id: string;
    title: string;
    image: string;
    time: string;
    calories: number;
    ingredients: { name: string; amount: string }[];
    matchPercentage?: number;
};

type RecipeDetailModalProps = {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe;
};

export function RecipeDetailModal({ isOpen, onClose, recipe }: RecipeDetailModalProps) {
    const { mutate: updateRecipe, isPending: isUpdating } = useUpdateRecipe();
    const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: recipe.title,
        image: recipe.image,
        time: recipe.time,
        calories: recipe.calories,
        ingredients: recipe.ingredients
    });

    const handleIngredientChange = (index: number, field: 'name' | 'amount', value: string) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const handleAddIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { name: '', amount: '' }]
        });
    };

    const handleRemoveIngredient = (index: number) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.filter((_, i) => i !== index)
        });
    };

    const handleSave = () => {
        updateRecipe({ ...formData, _id: recipe._id }, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const handleDelete = () => {
        toast("Are you sure you want to delete this recipe?", {
            action: {
                label: "Delete",
                onClick: () => {
                    deleteRecipe(recipe._id, {
                        onSuccess: () => {
                            onClose();
                            toast.success("Recipe deleted");
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-2xl h-[fit-content] max-h-[90vh] z-50 p-4 overflow-y-auto"
                    >
                        <div className="bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

                            {/* Header Image Area */}
                            <div className="relative h-64 w-full overflow-hidden group shrink-0">
                                <img
                                    src={formData.image}
                                    alt={formData.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                    {isEditing ? (
                                        <input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/50 text-2xl font-bold h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                    ) : (
                                        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">{formData.title}</h2>
                                    )}
                                    <div className="flex items-center gap-6 mt-3 text-white/90 text-sm font-medium">
                                        <span className="flex items-center gap-2">
                                            <Clock className="size-4" />
                                            {isEditing ? (
                                                <input
                                                    value={formData.time}
                                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                    className="h-7 w-24 bg-black/40 border border-white/30 rounded px-2 text-white focus:outline-none"
                                                />
                                            ) : formData.time}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Flame className="size-4" />
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={formData.calories}
                                                    onChange={e => setFormData({ ...formData, calories: Number(e.target.value) })}
                                                    className="h-7 w-24 bg-black/40 border border-white/30 rounded px-2 text-white focus:outline-none"
                                                />
                                            ) : `${formData.calories} kcal`}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={onClose} className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <div className="absolute top-4 left-4 flex gap-2">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-white/20 backdrop-blur-md border border-white/10 hover:bg-white/30 text-white rounded-full p-2 shadow-lg transition-colors"
                                            >
                                                <Edit2 className="size-4" />
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className="bg-red-500/80 hover:bg-red-600/90 text-white rounded-full p-2 shadow-lg transition-colors"
                                            >
                                                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="bg-white/20 backdrop-blur-md border border-white/10 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={isUpdating}
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg transition-colors flex items-center gap-2"
                                            >
                                                {isUpdating && <Loader2 className="size-3 animate-spin" />}
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 space-y-8 bg-card text-card-foreground">
                                {/* Image URL Input (Only when editing) */}
                                {isEditing && (
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-2">
                                        <label className="text-sm font-medium">Image URL</label>
                                        <input
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                )}

                                {/* Ingredients Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                            <BookOpen className="size-5" />
                                        </div>
                                        <h3 className="font-bold text-xl">Ingredients</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {formData.ingredients.map((ing, idx) => (
                                            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${isEditing ? 'border-primary/30 bg-primary/5' : 'border-border/40 bg-muted/20'}`}>
                                                {isEditing ? (
                                                    <div className="flex gap-2 w-full">
                                                        <input
                                                            value={ing.name}
                                                            onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                                                            className="flex-1 bg-background border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                            placeholder="Name"
                                                        />
                                                        <input
                                                            value={ing.amount}
                                                            onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                                                            className="w-20 bg-background border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-center"
                                                            placeholder="Qty"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveIngredient(idx)}
                                                            className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
                                                        >
                                                            <X className="size-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="font-medium text-sm">{ing.name}</span>
                                                        <span className="text-sm text-foreground/70 bg-secondary px-2.5 py-1 rounded-md font-medium">{ing.amount}</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <button
                                                onClick={handleAddIngredient}
                                                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-primary/20 text-primary/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium"
                                            >
                                                <Plus className="size-4" /> Add Ingredient
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Instructions Placeholder */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500">
                                            <Flame className="size-5" />
                                        </div>
                                        <h3 className="font-bold text-xl">Instructions</h3>
                                    </div>
                                    <div className="bg-muted/20 p-6 rounded-2xl border border-border/40">
                                        <p className="text-muted-foreground leading-relaxed">
                                            Instructions are currently auto-generated or placeholders since we are focusing on ingredients.
                                            In a future update, step-by-step instructions will be editable here!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
