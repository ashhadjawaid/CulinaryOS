import { Search, Sparkles } from 'lucide-react';

interface VideoSearchProps {
    onSearch: (query: string) => void;
    onAiRecommend: () => void;
    loading: boolean;
}

const VideoSearch = ({ onSearch, onAiRecommend, loading }: VideoSearchProps) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const query = (form.elements.namedItem('search') as HTMLInputElement).value;
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search for video recipes (e.g. 'Pasta Carbonara')..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                    type="button"
                    onClick={onAiRecommend}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md"
                >
                    <Sparkles size={18} />
                    <span>Ask AI</span>
                </button>
            </form>
        </div>
    );
};

export default VideoSearch;
