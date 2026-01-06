import { Request, Response } from 'express';
import { User } from '../models/User';

// Hardcoded user ID for single-user dev mode (Legacy)
export const DEFAULT_USER_ID = "659000000000000000000001";

export const getPantry = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.pantry);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addPantryItem = async (req: Request, res: Response) => {
    const { name, category, quantity, expiry, color } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.pantry.push({ name, category, quantity, expiry, color });
            await user.save();
            res.status(201).json(user.pantry);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updatePantryItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, quantity, expiry, color } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itemIndex = user.pantry.findIndex(item => item._id.toString() === id);
        if (itemIndex > -1) {
            user.pantry[itemIndex].name = name || user.pantry[itemIndex].name;
            user.pantry[itemIndex].category = category || user.pantry[itemIndex].category;
            user.pantry[itemIndex].quantity = quantity || user.pantry[itemIndex].quantity;
            user.pantry[itemIndex].expiry = expiry || user.pantry[itemIndex].expiry;
            user.pantry[itemIndex].color = color || user.pantry[itemIndex].color;
            await user.save();
            res.json(user.pantry);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deletePantryItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itemIndex = user.pantry.findIndex(item => item._id.toString() === id);
        if (itemIndex > -1) {
            user.pantry.splice(itemIndex, 1);
            await user.save();
            res.json(user.pantry);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
