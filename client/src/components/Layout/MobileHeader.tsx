import { Menu, ChefHat } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';

type MobileHeaderProps = {
    onOpenSidebar: () => void;
};

export function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
    const { user } = useAuth();

    return (
        <div className="lg:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                    <Menu className="size-6 text-foreground" />
                </button>
                <div className="flex items-center gap-2 text-primary">
                    <div className="p-1.5 bg-primary text-primary-foreground rounded-lg shadow-sm">
                        <ChefHat className="size-4" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">CulinaryOS</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                {user && (
                    <div className="size-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                        {user.profilePicture && !user.profilePicture.startsWith('http') && user.profilePicture.match(/\p{Emoji}/u) ? (
                            <span className="text-sm">{user.profilePicture}</span>
                        ) : user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-xs text-muted-foreground uppercase">{user.name[0]}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
