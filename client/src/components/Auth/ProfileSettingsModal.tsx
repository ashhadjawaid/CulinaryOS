import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Lock, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import api from '../../lib/api';

type ProfileSettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const DEFAULT_AVATARS = [
    '👨‍🍳', '👩‍🍳', '🥑', '🍔', '🍕', '🥗', '🥘', '🍣', '🍱', '🍦'
];

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [selectedEmoji, setSelectedEmoji] = useState(DEFAULT_AVATARS.includes(user?.profilePicture || '') ? user?.profilePicture : '');
    const [customImage, setCustomImage] = useState(!DEFAULT_AVATARS.includes(user?.profilePicture || '') ? user?.profilePicture : '');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handleUpdateProfile = async () => {
        setIsUpdatingProfile(true);
        try {
            const profilePicture = selectedEmoji || customImage;
            const res = await api.put('/auth/profile', {
                name,
                profilePicture
            });

            // Update local user state
            login(res.data);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        setIsUpdatingPassword(true);
        try {
            await api.put('/auth/password', {
                oldPassword,
                newPassword
            });
            toast.success('Password updated successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-[fit-content] max-h-[90vh] z-50 p-4"
                    >
                        <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-secondary/10">
                                <h2 className="text-xl font-bold">Settings</h2>
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="size-5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-border/50">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground hover:bg-muted/30'}`}
                                >
                                    <UserIcon className="size-4" /> Profile
                                    {activeTab === 'profile' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'security' ? 'text-primary' : 'text-muted-foreground hover:bg-muted/30'}`}
                                >
                                    <Lock className="size-4" /> Security
                                    {activeTab === 'security' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {activeTab === 'profile' ? (
                                    <div className="space-y-6">
                                        {/* Avatar Selection */}
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="size-24 rounded-full bg-secondary flex items-center justify-center text-4xl overflow-hidden border-2 border-border relative group">
                                                {customImage ? <img src={customImage} alt="Profile" className="w-full h-full object-cover" /> : (selectedEmoji || '👨‍🍳')}
                                            </div>

                                            <div className="w-full space-y-3">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Choose Avatar</label>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {DEFAULT_AVATARS.map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => { setSelectedEmoji(emoji); setCustomImage(''); }}
                                                            className={`size-10 rounded-full flex items-center justify-center text-xl transition-all ${selectedEmoji === emoji && !customImage ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'bg-secondary hover:bg-secondary/80'}`}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="w-full space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Or Custom URL</label>
                                                <div className="relative">
                                                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                                                    <input
                                                        value={customImage || ''}
                                                        onChange={(e) => { setCustomImage(e.target.value); setSelectedEmoji(''); }}
                                                        placeholder="https://..."
                                                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Display Name</label>
                                            <input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>

                                        <button
                                            onClick={handleUpdateProfile}
                                            disabled={isUpdatingProfile}
                                            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        >
                                            {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Current Password</label>
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>

                                        <button
                                            onClick={handleUpdatePassword}
                                            disabled={isUpdatingPassword}
                                            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                                        >
                                            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
