import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
    if (!dateString) return '';
    // Check if it's already in a simple text format (like "1 week")
    if (!dateString.includes('-') && !dateString.includes('/')) return dateString;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}
