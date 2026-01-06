import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ChefHat, BookOpen, CalendarDays, Package, LogOut, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ThemeToggle';
import { ProfileSettingsModal } from '../Auth/ProfileSettingsModal';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const links = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Pantry', icon: Package, path: '/pantry' },
        { name: 'Recipes', icon: BookOpen, path: '/recipes' },
        { name: 'Meal Planner', icon: CalendarDays, path: '/planner' },
    ];

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-card/95 backdrop-blur-xl border-r border-border">
            <div className="p-6">
                {/* Logo & Theme Toggle */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/25">
                            <ChefHat className="size-6" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">CulinaryOS</h1>
                    </div>
                    {/* Only show theme toggle on desktop sidebar, mobile has it in header */}
                    <div className="hidden lg:block">
                        <ThemeToggle />
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden p-2 hover:bg-muted rounded-lg text-muted-foreground">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="space-y-1">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={onClose} // Auto close on mobile nav
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <link.icon className={cn("size-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Footer */}
            <div className="mt-auto p-4 border-t border-border bg-muted/20">
                {user ? (
                    <div
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors group"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-lg overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
                            {user.profilePicture && !user.profilePicture.startsWith('http') && user.profilePicture.match(/\p{Emoji}/u) ? (
                                /* If it's an emoji */
                                <span className="text-2xl">{user.profilePicture}</span>
                            ) : user.profilePicture ? (
                                /* If it's a URL */
                                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                /* Default fallback */
                                <span className="font-bold text-muted-foreground uppercase">{user.name[0]}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate opacity-70">Manage Settings</p>
                        </div>
                        <LogOut
                            className="size-4 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                logout();
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center p-2">
                        <Link to="/login" className="text-sm font-bold text-primary hover:underline">Log In</Link>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar - Always Visible */}
            <div className="hidden lg:flex w-64 h-screen fixed left-0 top-0 z-40 flex-col transition-colors duration-300">
                <SidebarContent />
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-[280px] z-50 lg:hidden shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ProfileSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}
