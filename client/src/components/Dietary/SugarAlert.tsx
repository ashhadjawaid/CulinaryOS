import { AlertTriangle } from 'lucide-react';
import { getSubstitution } from '../../services/orderService';
import { toast } from 'sonner';

interface SugarAlertProps {
    ingredientName: string;
}

export const SugarAlert = ({ ingredientName }: SugarAlertProps) => {
    const handleCheckSubstitute = async () => {
        toast.info(`Finding substitute for ${ingredientName}...`);
        try {
            const result = await getSubstitution(ingredientName);
            if (result.found) {
                toast.success(`Substitute found: Use ${result.substitute} instead!`);
            } else {
                toast.info(result.message || "No specific substitute found.");
            }
        } catch (error) {
            toast.error("Could not fetch substitute.");
        }
    };

    return (
        <div className="flex items-center justify-between bg-red-50 border border-red-100 p-2 rounded-lg mt-2">
            <div className="flex items-center gap-2 text-red-700 text-xs font-medium">
                <AlertTriangle size={14} />
                <span>High Sugar: {ingredientName}</span>
            </div>
            <button
                onClick={handleCheckSubstitute}
                className="text-xs bg-white border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
                Find Substitute
            </button>
        </div>
    );
};
