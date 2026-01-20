import { useState, useEffect } from 'react';
import VideoSearch from '../components/AI/VideoSearch';
import VideoGrid from '../components/AI/VideoGrid';
import { searchVideos, getAiRecipeSuggestion } from '../services/orderService';
import type { VideoResult } from '../types/order';
import { toast } from 'sonner';

const VideoRecipes = () => {
    const [videos, setVideos] = useState<VideoResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleSearch('cooking recipes');
    }, []);

    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            const results = await searchVideos(query);
            setVideos(results);
        } catch (error) {
            toast.error("Failed to fetch videos");
        } finally {
            setLoading(false);
        }
    };

    const handleAiRecommend = async () => {
        setLoading(true);
        toast.info("Asking Chef AI for a surprise dish...");
        try {
            const data = await getAiRecipeSuggestion();
            const suggestion = data.suggestion;

            toast.success(`Chef suggests: ${suggestion}`);

            // Search with 'cooking recipe' context
            await handleSearch(`${suggestion} cooking recipe`);

        } catch (error) {
            toast.error("AI is taking a nap. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Video Recipe Search</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Find the best video tutorials for your next meal.</p>

            <VideoSearch
                onSearch={handleSearch}
                onAiRecommend={handleAiRecommend}
                loading={loading}
            />

            <VideoGrid videos={videos} />
        </div>
    );
};

export default VideoRecipes;
