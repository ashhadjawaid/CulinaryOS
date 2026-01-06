import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getPantry, addPantryItem, updatePantryItem, deletePantryItem } from '../controllers/pantryController';
import { getRecipes, getRecommendations, seedRecipes, addRecipe, updateRecipe, deleteRecipe } from '../controllers/recipeController';
import { getMealPlan, saveMealPlan } from '../controllers/plannerController';

const router = express.Router();
import { registerUser, loginUser, updatePassword, updateProfile } from '../controllers/authController';

// Auth Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.put('/auth/password', protect as any, updatePassword);
router.put('/auth/profile', protect as any, updateProfile);

// Pantry Routes
router.get('/pantry', protect as any, getPantry);
router.post('/pantry', protect as any, addPantryItem);
router.put('/pantry/:id', protect as any, updatePantryItem);
router.delete('/pantry/:id', protect as any, deletePantryItem);

// Recipe Routes
router.get('/recipes', getRecipes);
router.post('/recipes', addRecipe);
router.put('/recipes/:id', updateRecipe);
router.delete('/recipes/:id', deleteRecipe);
router.get('/recommendations', protect as any, getRecommendations);
router.post('/seed', seedRecipes); // Helper to seed DB

// Planner Routes
router.get('/planner', protect as any, getMealPlan);
router.post('/planner', protect as any, saveMealPlan);

export default router;
