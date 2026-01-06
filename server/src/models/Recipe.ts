import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: String, required: true }
});

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: false }, // Made optional as we might want defaults
    time: { type: String, required: true },
    calories: { type: Number, required: true },
    description: { type: String, required: false, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    servings: { type: Number, required: true, default: 2 },
    tags: [{ type: String }],
    ingredients: [IngredientSchema]
});

export const Recipe = mongoose.model('Recipe', RecipeSchema);
