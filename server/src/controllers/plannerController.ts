import { Request, Response } from 'express';
import { MealPlan } from '../models/MealPlan';
import { DEFAULT_USER_ID } from './pantryController';

export const getMealPlan = async (req: Request, res: Response) => {
    try {
        const plan = await MealPlan.findOne({ userId: req.user._id });
        res.json(plan ? plan.meals : []);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const saveMealPlan = async (req: Request, res: Response) => {
    const { meals } = req.body;
    try {
        let plan = await MealPlan.findOne({ userId: req.user._id });

        if (plan) {
            plan.meals = meals;
            await plan.save();
        } else {
            plan = await MealPlan.create({
                userId: req.user._id,
                weekStartDate: new Date(),
                meals
            });
        }
        res.json(plan.meals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
