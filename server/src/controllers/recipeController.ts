import { Request, Response } from 'express';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';

export const getRecipes = async (req: Request, res: Response) => {
    try {
        const recipes = await Recipe.find({});
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addRecipe = async (req: Request, res: Response) => {
    const { title, image, time, calories, ingredients, description, difficulty, servings, tags } = req.body;
    try {
        const newRecipe = new Recipe({
            title,
            image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', // Default placeholder
            time,
            calories,
            ingredients,
            description,
            difficulty,
            servings,
            tags
        });
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, image, time, calories, ingredients, description, difficulty, servings, tags } = req.body;
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { title, image, time, calories, ingredients, description, difficulty, servings, tags },
            { new: true }
        );
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        const recipes = await Recipe.find({});

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const pantryItems = user.pantry.map(item => item.name.toLowerCase());

        const recommendations = recipes.map(recipe => {
            const totalIngredients = recipe.ingredients.length;
            const matchingIngredients = recipe.ingredients.filter(ing =>
                pantryItems.some(pItem => pItem.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(pItem))
            ).length;

            const matchPercentage = totalIngredients > 0
                ? Math.round((matchingIngredients / totalIngredients) * 100)
                : 0;

            return {
                ...recipe.toObject(),
                matchPercentage
            };
        });

        // Sort by highest match first
        recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Seed endpoint for development
export const seedRecipes = async (req: Request, res: Response) => {
    try {
        await Recipe.deleteMany({});
        const recipes = [
            {
                title: "Avocado Chicken Salad",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
                time: "15 mins",
                calories: 350,
                description: "A fresh and nutritious salad packed with protein and healthy fats. Perfect for a quick lunch.",
                difficulty: "Easy",
                servings: 2,
                tags: ["Healthy", "Keto", "Lunch"],
                ingredients: [
                    { name: "Avocado", amount: "1" },
                    { name: "Chicken Breast", amount: "200g" },
                    { name: "Spinach", amount: "100g" },
                    { name: "Lemon", amount: "1/2" }
                ]
            },
            {
                title: "Lemon Garlic Salmon",
                image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800&q=80",
                time: "25 mins",
                calories: 450,
                description: "Succulent salmon fillets seared with aromatic garlic and zesty lemon.",
                difficulty: "Medium",
                servings: 2,
                tags: ["Seafood", "Dinner", "Gluten-Free"],
                ingredients: [
                    { name: "Salmon Fillet", amount: "1" },
                    { name: "Lemon", amount: "1" },
                    { name: "Garlic", amount: "2 cloves" },
                    { name: "Asparagus", amount: "1 bunch" }
                ]
            },
            {
                title: "Rice Bowl",
                image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
                time: "20 mins",
                calories: 400,
                description: "A simple yet satisfying rice bowl with yogurt and tender chicken.",
                difficulty: "Easy",
                servings: 1,
                tags: ["Comfort Food", "Quick"],
                ingredients: [
                    { name: "Basmati Rice", amount: "1 cup" },
                    { name: "Greek Yogurt", amount: "2 tbsp" },
                    { name: "Chicken Breast", amount: "100g" }
                ]
            }
        ];
        await Recipe.insertMany(recipes);
        res.json({ message: 'Recipes Seeded' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
