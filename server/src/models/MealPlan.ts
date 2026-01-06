import mongoose from 'mongoose';

const MealPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStartDate: { type: Date, required: true },
    meals: [{
        day: { type: String, required: true },
        recipeId: { type: String, required: true }, // Keeping loose reference for flexibility or could be ObjectId
        description: { type: String, required: true },
        color: { type: String }
    }]
});

export const MealPlan = mongoose.model('MealPlan', MealPlanSchema);
