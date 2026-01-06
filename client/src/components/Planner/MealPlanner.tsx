import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useMealPlan, useUpdateMealPlan } from '../../hooks/useCulinary';
import { AddMealModal } from './AddMealModal';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming cn exists

type Meal = {
    id: string;
    description: string;
    day: string;
    color: string;
    recipeId: string;
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MealPlanner() {
    const { data: serverMeals, isLoading } = useMealPlan();
    const { mutate: updatePlan } = useUpdateMealPlan();
    const [localMeals, setLocalMeals] = useState<Meal[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [addModal, setAddModal] = useState<{ isOpen: boolean; day: string }>({ isOpen: false, day: '' });

    // Sync server state to local state
    useEffect(() => {
        if (serverMeals) {
            setLocalMeals(serverMeals);
        }
    }, [serverMeals]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Find the item being dragged
            const activeItem = localMeals.find(item => item.id === active.id);
            // If dragging over a column (day), the over.id is the day name
            // If dragging over another card, we need to find that card's day (handled by column droppable mostly)

            // Simplified logic: We only drop onto columns for now to change days
            if (DAYS.includes(over.id as string) && activeItem) {
                const newMeals = localMeals.map(item => {
                    if (item.id === active.id) {
                        return { ...item, day: over.id as string };
                    }
                    return item;
                });
                setLocalMeals(newMeals);
                updatePlan(newMeals);
            }
        }
        setActiveId(null);
    };

    const handleAddMeal = (recipeId: string, description: string, color: string) => {
        const newMeal: Meal = {
            id: `meal-${Date.now()}`,
            description,
            day: addModal.day,
            color,
            recipeId
        };
        const updatedMeals = [...localMeals, newMeal];
        setLocalMeals(updatedMeals);
        updatePlan(updatedMeals);
    };

    if (isLoading && localMeals.length === 0) return <div className="p-10 text-center animate-pulse">Loading planner...</div>;

    return (
        <>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px]">
                    {DAYS.map((day) => (
                        <PlannerColumn
                            key={day}
                            id={day}
                            title={day}
                            meals={localMeals.filter(m => m.day === day)}
                            onAdd={() => setAddModal({ isOpen: true, day })}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="p-3 rounded-xl bg-card border border-primary shadow-2xl rotate-3 cursor-grabbing w-full">
                            <div className="font-bold text-sm">{localMeals.find(m => m.id === activeId)?.description}</div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <AddMealModal
                isOpen={addModal.isOpen}
                onClose={() => setAddModal({ ...addModal, isOpen: false })}
                day={addModal.day}
                onAdd={handleAddMeal}
            />
        </>
    );
}

function PlannerColumn({ id, title, meals, onAdd }: { id: string; title: string, meals: Meal[], onAdd: () => void }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col gap-3 rounded-2xl p-2 transition-colors h-full border border-dashed flex-1 min-w-[140px]",
                isOver ? "bg-primary/5 border-primary" : "bg-card/30 border-border"
            )}
        >
            <div className="flex justify-between items-center px-1">
                <h3 className="font-bold text-muted-foreground uppercase text-xs tracking-wider">{title}</h3>
                <button onClick={onAdd} className="text-muted-foreground hover:text-primary transition-colors">
                    <Plus className="size-4" />
                </button>
            </div>

            <div className="flex flex-col gap-2 h-full overflow-y-auto min-h-[100px]">
                <AnimatePresence>
                    {meals.map((meal) => (
                        <PlannerCard key={meal.id} meal={meal} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function PlannerCard({ meal }: { meal: Meal }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: meal.id,
    });

    // Helper to ensure legacy colors look good in dark mode
    const getAdaptiveColor = (colorClass: string) => {
        // If it already has dark mode classes, trust it (but we might want to override if they are the old insufficient ones? 
        // For now, let's assume if it has 'dark:', it is a "new" style. 
        // actually, let's just force the mapping based on base color to be safe and consistent).

        // Identify the base color
        if (colorClass.includes('orange')) return 'bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-900/80 dark:border-orange-700 dark:text-orange-50';
        if (colorClass.includes('blue')) return 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/80 dark:border-blue-700 dark:text-blue-50';
        if (colorClass.includes('green')) return 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/80 dark:border-green-700 dark:text-green-50';
        if (colorClass.includes('purple')) return 'bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-900/80 dark:border-purple-700 dark:text-purple-50';
        if (colorClass.includes('pink')) return 'bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-900/80 dark:border-pink-700 dark:text-pink-50';
        if (colorClass.includes('yellow')) return 'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/80 dark:border-yellow-700 dark:text-yellow-50';

        return colorClass;
    };

    return (
        <motion.div
            ref={setNodeRef}
            layoutId={meal.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            {...listeners}
            {...attributes}
            className={cn(
                "p-3 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all text-sm font-medium",
                getAdaptiveColor(meal.color),
                isDragging && "opacity-50"
            )}
        >
            {meal.description}
        </motion.div>
    );
}
