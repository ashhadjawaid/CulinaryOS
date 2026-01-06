import mongoose from 'mongoose';

const PantryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: String, required: true },
    expiry: { type: String, required: true },
    color: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    pantry: [PantryItemSchema]
});

export const User = mongoose.model('User', UserSchema);
