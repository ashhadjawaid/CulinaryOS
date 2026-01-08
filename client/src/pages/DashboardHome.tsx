import { motion } from 'framer-motion';
import { usePantry, useRecipes, useMealPlan } from '../hooks/useCulinary';
import { Box, BookOpen, Calendar, Activity, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';


export function DashboardHome() {
    const { data: pantry } = usePantry();
    const { data: recipes } = useRecipes();
    const { data: mealPlan } = useMealPlan();

    // Stats
    const stats = [
        { label: 'Pantry Items', value: pantry?.length || 0, icon: <Box className="size-5 text-green-600" />, bg: 'bg-green-100', link: '/pantry' },
        { label: 'Recipes', value: recipes?.length || 0, icon: <BookOpen className="size-5 text-rose-600" />, bg: 'bg-rose-100', link: '/recipes' },
        { label: 'Meals Planned', value: mealPlan?.reduce((acc: number, d: any) => acc + (d.meals?.length || 0), 0) || 0, icon: <Calendar className="size-5 text-orange-600" />, bg: 'bg-orange-100', link: '/planner' },
        { label: 'Avg. Match', value: '72%', icon: <Activity className="size-5 text-blue-600" />, bg: 'bg-blue-100', link: '/recipes' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Good morning, Chef! 👨‍🍳</h1>
                <p className="text-muted-foreground text-lg">
                    Let's plan something delicious today. You have <span className="font-bold text-primary">{pantry?.length || 0} ingredients</span> ready in your pantry.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Link to={stat.link} key={i} className="block group">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className={`size-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Your Pantry Preview */}
                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm col-span-1">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Box className="size-5 text-primary" />
                            <h3 className="font-bold text-lg">Your Pantry</h3>
                        </div>
                        <Link to="/pantry" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                            View all <ChevronRight className="size-4" />
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {pantry?.slice(0, 5).map((item: any, i: number) => (
                            <span key={i} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium flex items-center gap-2">
                                {item.name}
                                {item.expiry && <span className="size-2 rounded-full bg-green-500" />}
                            </span>
                        ))}
                        {(pantry?.length || 0) > 5 && (
                            <span className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium">
                                +{(pantry?.length || 0) - 5} more
                            </span>
                        )}
                        {(pantry?.length === 0) && <p className="text-sm text-muted-foreground">Your pantry is empty.</p>}
                    </div>
                </div>

                {/* Smart Suggestions (Featured) */}
                <div className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-xl shadow-primary/20 col-span-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="size-32" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2 opacity-90">
                                <Sparkles className="size-5" />
                                <span className="font-bold text-sm tracking-wide uppercase">Smart Suggestions</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Dinner Ideas?</h3>
                            <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                Based on your pantry, we found 3 recipes you can make right now!
                            </p>
                        </div>
                        <Link to="/recipes">
                            <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                                Explore Recipes
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Today's Plan */}
                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm col-span-1 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-5 text-orange-500" />
                            <h3 className="font-bold text-lg">Today's Plan</h3>
                        </div>
                        <Link to="/planner" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                            Plan more <ChevronRight className="size-4" />
                        </Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {/* Placeholder for now since meal plan structure is complex */}
                        <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                            <div className="size-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                <Clock className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Avocado Toast Supreme</h4>
                                <p className="text-xs text-muted-foreground">Breakfast • 8:00 AM</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                            <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Clock className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Mediterranean Salad</h4>
                                <p className="text-xs text-muted-foreground">Lunch • 12:30 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Best Matches */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Sparkles className="size-5 text-rose-500" /> Best Matches
                    </h3>
                    <Link to="/recipes" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                        See all <ChevronRight className="size-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recipes?.slice(0, 3).map((recipe: any) => (
                        <Link to="/recipes" key={recipe.id || recipe._id} className="group">
                            <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                        Medium
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span>Pantry Match</span>
                                            <span className="text-green-600">92%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: '92%' }} />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{recipe.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                        Delicious and healthy option for your meal.
                                    </p>
                                    <div className="flex gap-3 text-xs font-medium text-muted-foreground mt-auto">
                                        <span className="bg-secondary px-2 py-1 rounded-md">{recipe.time}</span>
                                        <span className="bg-secondary px-2 py-1 rounded-md">{recipe.calories} kcal</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
