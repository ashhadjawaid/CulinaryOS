import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import appBg from '../../assets/app-bg.png';
import appBgDark from '../../assets/app-bg-dark.png';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { MobileHeader } from './MobileHeader';

export function AppLayout() {
    const { theme } = useTheme();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const location = useLocation();

    // Close mobile nav on route change
    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [location.pathname]);

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden relative transition-colors duration-500 flex-col lg:flex-row">
            {/* Global Background */}
            <div className="absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none">
                <img
                    src={isDark ? appBgDark : appBg}
                    alt="App Background"
                    className="w-full h-full object-cover opacity-100 transition-all duration-700"
                />
                {/* Overlay for cinematic feel */}
                <div className="absolute inset-0 bg-white/40 dark:bg-black/70 backdrop-blur-[2px] transition-colors duration-500" />
            </div>

            {/* Mobile Header */}
            <MobileHeader onOpenSidebar={() => setIsMobileNavOpen(true)} />

            {/* Sidebar (Desktop + Mobile Drawer) */}
            <div className="relative z-50">
                <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative w-full z-10 lg:ml-64 p-4 lg:p-10 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/30">
                <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 pb-20 lg:pb-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
