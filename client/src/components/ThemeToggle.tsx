import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300",
                "bg-card/50 backdrop-blur-sm border border-border/50", // Added glass effect for overlay usage
                className
            )}
            title={`Theme: ${theme}`}
        >
            {theme === 'light' && <Sun className="size-5" />}
            {theme === 'dark' && <Moon className="size-5" />}
            {theme === 'system' && <Laptop className="size-5" />}
        </button>
    );
}
