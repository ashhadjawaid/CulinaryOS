export type PantryItem = {
    _id?: string;
    id: string;
    name: string;
    category: "Produce" | "Protein" | "Grains" | "Dairy" | "Spices";
    quantity: string;
    expiry: string;
    color: string; // For the "pill" visual
};

export const MOCK_PANTRY: PantryItem[] = [
    { id: "1", name: "Avocado", category: "Produce", quantity: "2 units", expiry: "2 days", color: "bg-green-500" },
    { id: "2", name: "Chicken Breast", category: "Protein", quantity: "500g", expiry: "4 days", color: "bg-orange-400" },
    { id: "3", name: "Basmati Rice", category: "Grains", quantity: "1kg", expiry: "6 months", color: "bg-yellow-200" },
    { id: "4", name: "Greek Yogurt", category: "Dairy", quantity: "1 tub", expiry: "1 week", color: "bg-blue-300" },
    { id: "5", name: "Spinach", category: "Produce", quantity: "1 bag", expiry: "3 days", color: "bg-green-600" },
    { id: "6", name: "Lemon", category: "Produce", quantity: "3 units", expiry: "1 week", color: "bg-yellow-400" },
    { id: "7", name: "Garlic", category: "Spices", quantity: "2 bulbs", expiry: "2 weeks", color: "bg-stone-300" },
    { id: "8", name: "Salmon Fillet", category: "Protein", quantity: "2 units", expiry: "2 days", color: "bg-rose-400" },
];
