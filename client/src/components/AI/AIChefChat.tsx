import { useState } from 'react';
import { Bot, X, Send, ChefHat } from 'lucide-react';
import { chatWithIChef } from '../../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIChefChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
        { sender: 'bot', text: 'Hello! I am your AI Chef. Ask me anything about recipes or cooking tips!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Resize State
    const [chatSize, setChatSize] = useState({ width: 384, height: 600 });

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const data = await chatWithIChef(userMsg);
            setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting to the kitchen server." }]);
        } finally {
            setLoading(false);
        }
    };

    // Resize Handler
    const startResizing = (mouseDownEvent: React.MouseEvent) => {
        mouseDownEvent.preventDefault();

        const startX = mouseDownEvent.clientX;
        const startY = mouseDownEvent.clientY;
        const startWidth = chatSize.width;
        const startHeight = chatSize.height;

        const onMouseMove = (mouseMoveEvent: MouseEvent) => {
            const deltaX = startX - mouseMoveEvent.clientX;
            const deltaY = startY - mouseMoveEvent.clientY;

            setChatSize({
                width: Math.max(300, Math.min(800, startWidth + deltaX)),
                height: Math.max(400, Math.min(900, startHeight + deltaY))
            });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'nwse-resize';
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center transition-colors"
            >
                <ChefHat size={32} />
            </motion.button>

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        style={{ width: chatSize.width, height: chatSize.height }}
                        className="fixed bottom-24 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 font-sans"
                    >
                        {/* Resize Handle (Top-Left) */}
                        <div
                            onMouseDown={startResizing}
                            className="absolute top-0 left-0 w-6 h-6 z-50 cursor-nwse-resize group flex items-start justify-start p-1"
                        >
                            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors" />
                        </div>

                        {/* Header */}
                        <div className="bg-orange-500 p-4 flex justify-between items-center text-white relative">
                            <div className="flex items-center gap-2 pl-4">
                                <Bot size={24} />
                                <h3 className="font-bold">AI Chef Assistant</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setChatSize({ width: 384, height: 600 })}
                                    className="p-1 hover:bg-orange-600 rounded text-xs opacity-70 hover:opacity-100"
                                >
                                    Reset
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:bg-orange-600 p-1 rounded">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-orange-500 text-white rounded-br-none'
                                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        {msg.sender === 'bot' ? (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-2" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-1 mt-2" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-semibold text-orange-600 dark:text-orange-400" {...props} />,
                                                    table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 border dark:border-gray-600" {...props} /></div>,
                                                    thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
                                                    th: ({ node, ...props }) => <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-600" {...props} />,
                                                    td: ({ node, ...props }) => <td className="px-3 py-2 whitespace-normal text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-600" {...props} />,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full animate-pulse text-sm text-gray-500">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about recipes..."
                                className="flex-1 p-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChefChat;
