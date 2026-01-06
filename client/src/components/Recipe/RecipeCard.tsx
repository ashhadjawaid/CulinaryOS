import { motion } from 'framer-motion';
import { Clock, Users, ChefHat } from 'lucide-react';
import type { Recipe } from '../../data/mockRecipes';

interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
    index: number;
}

export function RecipeCard({ recipe, onClick, index }: RecipeCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={onClick}
            className="group bg-card border border-border/50 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full"
        >
            {/* Image Area */}
            <div className="relative h-48 overflow-hidden shrink-0">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Difficulty Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {recipe.difficulty || 'Medium'}
                </div>

                {/* Pantry Match Overlay Bar (Inside Image) */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-foreground">Pantry Match</span>
                        <span className={`text-xs font-bold ${(recipe.matchPercentage || 0) >= 80 ? 'text-green-600' :
                            (recipe.matchPercentage || 0) >= 50 ? 'text-orange-500' : 'text-red-500'
                            }`}>
                            {recipe.matchPercentage || 0}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${(recipe.matchPercentage || 0) >= 80 ? 'bg-green-500' :
                                (recipe.matchPercentage || 0) >= 50 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${recipe.matchPercentage || 0}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">{recipe.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {recipe.description || 'A delicious homemade recipe perfect for any meal.'}
                    </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50 mb-4">
                    <div className="flex flex-col items-center justify-center text-center gap-1">
                        <Clock className="size-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">{recipe.time.replace('mins', 'min')}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1 border-l border-border/50">
                        <Users className="size-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">{recipe.servings || 2} servings</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1 border-l border-border/50">
                        <ChefHat className="size-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">{recipe.ingredients.length} items</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {(recipe.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-secondary/80 text-secondary-foreground px-2.5 py-1 rounded-md">
                            {tag}
                        </span>
                    ))}
                    {(recipe.tags?.length || 0) === 0 && (
                        <>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary/50 text-secondary-foreground/70 px-2.5 py-1 rounded-md">
                                {recipe.calories} kcal
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary/50 text-secondary-foreground/70 px-2.5 py-1 rounded-md">
                                Tasty
                            </span>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
