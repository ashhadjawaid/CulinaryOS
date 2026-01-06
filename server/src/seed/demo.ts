import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { MealPlan } from '../models/MealPlan';
import { Recipe } from '../models/Recipe';
import connectDB from '../config/db';

dotenv.config();

const seedDemo = async () => {
    await connectDB();

    const email = 'demo@culinary.os';
    const password = 'demo123';
    const name = 'Chef Demo';

    try {
        // 1. Clean up existing demo user
        await User.deleteOne({ email });
        console.log('Existing demo user removed (if any).');

        // 2. Create User with Pantry Items
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            pantry: [
                { name: 'Chicken Breast', category: 'Protein', quantity: '500g', expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), color: 'bg-orange-100 text-orange-700' },
                { name: 'Avocado', category: 'Produce', quantity: '3', expiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), color: 'bg-green-100 text-green-700' },
                { name: 'Lemon', category: 'Produce', quantity: '5', expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), color: 'bg-yellow-100 text-yellow-700' },
                { name: 'Basmati Rice', category: 'Grains', quantity: '1kg', expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), color: 'bg-amber-100 text-amber-700' },
                { name: 'Garlic', category: 'Produce', quantity: '3 bulbs', expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), color: 'bg-slate-100 text-slate-700' },
                { name: 'Spinach', category: 'Produce', quantity: '200g', expiry: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), color: 'bg-green-100 text-green-700' },
                { name: 'Greek Yogurt', category: 'Dairy', quantity: '500g', expiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), color: 'bg-blue-100 text-blue-700' }
            ]
        });

        console.log(`Demo User Created: ${email} / ${password} (ID: ${user._id})`);

        // 3. Ensure Recipes Exist
        const recipesData = [
            {
                title: 'Avocado Chicken Salad',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
                time: '20 mins',
                calories: 450,
                ingredients: [
                    { name: 'Chicken Breast', amount: '200g' },
                    { name: 'Avocado', amount: '1' },
                    { name: 'Spinach', amount: '100g' },
                    { name: 'Lemon', amount: '1/2' }
                ]
            },
            {
                title: 'Lemon Herb Rice Bowl',
                image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=800&q=80',
                time: '35 mins',
                calories: 520,
                ingredients: [
                    { name: 'Basmati Rice', amount: '1 cup' },
                    { name: 'Lemon', amount: '1' },
                    { name: 'Garlic', amount: '2 cloves' },
                    { name: 'Greek Yogurt', amount: '2 tbsp' }
                ]
            },
            {
                title: 'Garlic Spinach Chicken',
                image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
                time: '25 mins',
                calories: 380,
                ingredients: [
                    { name: 'Chicken Breast', amount: '200g' },
                    { name: 'Spinach', amount: '150g' },
                    { name: 'Garlic', amount: '3 cloves' }
                ]
            }
        ];

        const createdRecipes = [];
        for (const rData of recipesData) {
            // Upsert recipe based on title to avoid duplicates but ensure current ID
            let request = await Recipe.findOne({ title: rData.title });
            if (!request) {
                request = await Recipe.create(rData);
                console.log(`Created new recipe: ${request.title}`);
            } else {
                console.log(`Found existing recipe: ${request.title}`);
            }
            createdRecipes.push(request);
        }

        // 4. Create Meal Plan
        // Clear old meal plans for this user
        await MealPlan.deleteMany({ userId: user._id });

        const today = new Date();
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
        startOfWeek.setDate(diff); // Set to Monday
        startOfWeek.setHours(0, 0, 0, 0);

        console.log(`Creating meal plan for week starting: ${startOfWeek.toDateString()}`);

        await MealPlan.create({
            userId: user._id,
            weekStartDate: startOfWeek,
            meals: [
                {
                    day: 'Mon',
                    recipeId: createdRecipes[0]._id.toString(),
                    description: 'Healthy Lunch',
                    color: 'bg-green-100'
                },
                {
                    day: 'Wed',
                    recipeId: createdRecipes[1]._id.toString(),
                    description: 'Post-workout meal',
                    color: 'bg-blue-100'
                },
                {
                    day: 'Fri',
                    recipeId: createdRecipes[2]._id.toString(),
                    description: 'Dinner with friends',
                    color: 'bg-orange-100'
                }
            ]
        });

        console.log('Meal Plan Created successfully.');

        process.exit();
    } catch (error) {
        console.error('Error seeding demo:', error);
        process.exit(1);
    }
};

seedDemo();
