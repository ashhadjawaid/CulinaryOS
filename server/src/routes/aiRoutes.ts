import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Mock Data for Videos
const MOCK_VIDEOS = [
    { title: "Perfect Homemade Pasta", thumbnail: "https://img.youtube.com/vi/n1wS8eL3zZs/0.jpg", videoId: "n1wS8eL3zZs" },
    { title: "Gordon Ramsay's Carbonara", thumbnail: "https://img.youtube.com/vi/BelInF1qTu4/0.jpg", videoId: "BelInF1qTu4" },
    { title: "Easy 15-Minute Chicken", thumbnail: "https://img.youtube.com/vi/2kr7094j9o8/0.jpg", videoId: "2kr7094j9o8" },
    { title: "Vegan Chocolate Cake", thumbnail: "https://img.youtube.com/vi/b3p80tqZLlo/0.jpg", videoId: "b3p80tqZLlo" },
    { title: "Healthy Salad Recipes", thumbnail: "https://img.youtube.com/vi/Gz9S7j_m6pU/0.jpg", videoId: "Gz9S7j_m6pU" }
];

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const SYSTEM_PROMPT = `
You are an expert AI Chef in the CulinaryOS application.
Your goal is to help users with cooking, recipes, meal planning, and kitchen advice.

Response Guidelines:
1.  **Structure & Formatting**:
    *   **Use Markdown**: Always use Markdown to structure your response.
    *   **Headings**: Use bold headers (e.g., **Ingredients**, **Instructions**) to separate sections.
    *   **Tables**: ALWAYS use a Markdown table for lists of ingredients or data comparisons.
    *   **Lists**: Use bullet points or numbered lists for steps.
    *   **Conciseness**: Avoid long paragraphs. Keep explanations clear and fast to read.

2.  **Context Aware**:
    *   If the user asks for a recipe, provide a Table of Ingredients followed by Step-by-Step Instructions.
    *   If the user asks a simple question, give a concise, direct answer.

3.  **Scope**: If the user asks about topics unrelated to food, cooking, or kitchen management, politely decline and steer the conversation back to culinary topics.
`;

// Route: Get Video Recommendations (Keep existing video route...)
router.get('/videos', async (req: Request, res: Response) => {
    // ... (Keep existing implementation)
    const { query } = req.query;
    console.log(`Searching videos for: ${query}`);

    if (!process.env.YOUTUBE_API_KEY) {
        console.error("YOUTUBE_API_KEY is missing in environment variables");
        return res.status(500).json({ message: 'YouTube API Key is missing' });
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                type: 'video',
                maxResults: 9,
                q: query,
                key: process.env.YOUTUBE_API_KEY
            }
        });

        const videos = response.data.items.map((item: any) => ({
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            videoId: item.id.videoId,
            channelTitle: item.snippet.channelTitle
        }));

        res.json(videos);
    } catch (error: any) {
        console.error('YouTube API Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch videos from YouTube' });
    }
});

// Route: AI Chatbot
router.post('/chat', async (req: Request, res: Response) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });

    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ reply: "I'm currently offline (API Key Missing). Please check my settings!" });
    }

    try {
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to assist as the AI Chef." }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        res.json({ reply });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ reply: "I'm having a little trouble thinking right now. The oven might be too hot! Try again in a moment." });
    }
});

// Route: AI Recipe Suggestion for Video Search
router.post('/suggest', async (req: Request, res: Response) => {
    try {
        const prompt = "Suggest ONE creative, delicious, specific dish name for a user to cook. Just the name, nothing else. Examples: 'Beef Wellington', 'Shrimp Scampi', 'Vegetable Pad Thai'.";
        const result = await model.generateContent(prompt);
        const suggestion = result.response.text().trim();
        res.json({ suggestion });
    } catch (error) {
        console.error("Gemini Suggestion Error:", error);
        res.status(500).json({ suggestion: "Classic Spaghetti Carbonara" }); // Fallback
    }
});

// Route: Diabetic Substitutions (Mock)
router.post('/substitute', (req: Request, res: Response) => {
    const { ingredient } = req.body;
    const swaps: Record<string, string> = {
        'sugar': 'Stevia or Erythritol',
        'white rice': 'Cauliflower Rice or Quinoa',
        'white flour': 'Almond Flour or Coconut Flour',
        'pasta': 'Zucchini Noodles or Chickpea Pasta',
        'milk': 'Unsweetened Almond Milk'
    };

    const cleanName = ingredient.toLowerCase();
    const substitute = swaps[cleanName];

    if (substitute) {
        res.json({ found: true, original: ingredient, substitute });
    } else {
        res.json({ found: false, message: "No specific substitute found, try reducing portion size." });
    }
});

export default router;
