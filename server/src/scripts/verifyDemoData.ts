import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { MealPlan } from '../models/MealPlan';
import connectDB from '../config/db';

dotenv.config();

const verifyData = async () => {
    await connectDB();

    const email = 'demo@culinary.os';

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found!');
            process.exit(1);
        }
        console.log(`User found: ${user._id}`);

        const plans = await MealPlan.find({ userId: user._id });
        console.log(`Found ${plans.length} meal plans.`);
        plans.forEach(p => {
            console.log(`Plan ID: ${p._id}`);
            console.log(`Week Start: ${p.weekStartDate} (${p.weekStartDate.toISOString()})`);
            console.log(`Meals: ${JSON.stringify(p.meals, null, 2)}`);
        });

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyData();
