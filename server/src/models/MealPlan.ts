import mongoose from 'mongoose';

const MealPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStartDate: { type: Date, required: true },
    meals: [{
        id: { type: String, required: true }, // Persist client-side ID
        day: { type: String, required: true },
        recipeId: { type: String, required: true },
        description: { type: String, required: true },
        color: { type: String }
    }]
});

export const MealPlan = mongoose.model('MealPlan', MealPlanSchema);
