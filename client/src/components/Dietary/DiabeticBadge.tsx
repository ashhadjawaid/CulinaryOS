import { Activity } from 'lucide-react';

export const DiabeticBadge = () => {
    return (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
            <Activity size={12} />
            Diabetic Friendly
        </span>
    );
};
