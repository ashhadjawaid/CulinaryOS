export type Ingredient = {
    name: string;
    amount: string;
};

export type Recipe = {
    _id?: string;
    id: string;
    title: string;
    image: string;
    time: string;
    calories: number;
    description?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    servings?: number;
    tags?: string[];
    ingredients: Ingredient[];
    matchPercentage?: number; // Calculated on client for now
};

export const MOCK_RECIPES: Recipe[] = [
    {
        id: "r1",
        title: "Avocado Chicken Salad",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
        time: "15 mins",
        calories: 350,
        ingredients: [
            { name: "Avocado", amount: "1" },
            { name: "Chicken Breast", amount: "200g" },
            { name: "Spinach", amount: "100g" },
            { name: "Lemon", amount: "1/2" }
        ]
    },
    {
        id: "r2",
        title: "Lemon Garlic Salmon",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800&q=80",
        time: "25 mins",
        calories: 450,
        ingredients: [
            { name: "Salmon Fillet", amount: "1" },
            { name: "Lemon", amount: "1" },
            { name: "Garlic", amount: "2 cloves" },
            { name: "Asparagus", amount: "1 bunch" } // Missing from pantry
        ]
    },
    {
        id: "r3",
        title: "Rice Bowl",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
        time: "20 mins",
        calories: 400,
        ingredients: [
            { name: "Basmati Rice", amount: "1 cup" },
            { name: "Greek Yogurt", amount: "2 tbsp" },
            { name: "Chicken Breast", amount: "100g" }
        ]
    }
];
