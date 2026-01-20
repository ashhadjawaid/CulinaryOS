import type { VideoResult } from '../../types/order';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoGridProps {
    videos: VideoResult[];
}

import { useState } from 'react';

const VideoGrid = ({ videos }: VideoGridProps) => {
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    if (videos.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-12">
                <p>No videos found. Try searching for a recipe!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
                <motion.div
                    key={video.videoId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => setPlayingVideo(video.videoId)}
                >
                    <div className="relative aspect-video bg-gray-200">
                        {playingVideo === video.videoId ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <>
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                                        <Play size={24} className="text-orange-600 fill-orange-600" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                            {video.title}
                        </h3>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default VideoGrid;
