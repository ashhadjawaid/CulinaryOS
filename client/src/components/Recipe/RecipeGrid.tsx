
import { useRecipes, usePantry } from '../../hooks/useCulinary';
import { Search, Plus, SlidersHorizontal, ChefHat, BookOpen } from 'lucide-react';
import { useState, useMemo } from 'react';
import { RecipeDetailModal } from './RecipeDetailModal';
import { AddRecipeModal } from './AddRecipeModal';
import { RecipeCard } from './RecipeCard';

export function RecipeGrid() {
    const { data: recipes, isLoading } = useRecipes();
    const { data: pantry } = usePantry();
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

    const activePantryCount = pantry?.length || 0;

    const filteredRecipes = useMemo(() => {
        if (!recipes) return [];
        let result = [...recipes];

        // Filter by Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.title.toLowerCase().includes(q) ||
                r.ingredients.some(i => i.name.toLowerCase().includes(q)) ||
                (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
            );
        }

        // Filter by Difficulty
        if (filter !== 'All') {
            result = result.filter(r => r.difficulty === filter);
        }

        return result;
    }, [recipes, searchQuery, filter]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground animate-pulse">Curating your cookbook...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400">
                        <BookOpen className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
                        <p className="text-muted-foreground font-medium">
                            <span className="text-primary">{filteredRecipes.length}</span> recipes available
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Banner */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                    <ChefHat className="size-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground">
                        Match percentages are based on your <span className="text-red-500">{activePantryCount} active pantry items</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Toggle ingredients in your pantry to update matches
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <input
                        type="text"
                        placeholder="Search recipes, ingredients, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {/* Add Button - Integrated into filter bar or standalone? Keeping standalone logic but styling matches context */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold whitespace-nowrap shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mr-2"
                    >
                        <Plus className="size-4" /> New
                    </button>

                    <div className="h-full w-px bg-border/50 mx-1"></div>

                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setFilter(lvl)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${filter === lvl
                                ? 'bg-foreground text-background border-foreground'
                                : 'bg-card text-muted-foreground border-border hover:bg-muted/50'
                                }`}
                        >
                            {lvl === 'All' && <SlidersHorizontal className="inline-block size-3 mr-2" />}
                            {lvl === 'All' ? 'Best Match' : lvl}
                            {/* Note: 'Best Match' is conventionally just 'All' sorted by match, which our backend does by default */}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe, index) => (
                    <RecipeCard
                        key={recipe._id || recipe.id}
                        recipe={recipe}
                        index={index}
                        onClick={() => setSelectedRecipe(recipe)}
                    />
                ))}
            </div>

            {filteredRecipes.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <p className="text-xl font-bold">No recipes found matching your criteria</p>
                    <p>Try adjusting your filters or pantry items</p>
                </div>
            )}

            {selectedRecipe && (
                <RecipeDetailModal
                    isOpen={!!selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                    recipe={selectedRecipe}
                />
            )}

            <AddRecipeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
