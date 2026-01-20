export interface Order {
    _id: string;
    title: string;
    specifications?: string;
    startTime: string; // ISO Date string
    endTime: string;   // ISO Date string
    duration: number;  // minutes
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
}

export interface VideoResult {
    videoId: string;
    title: string;
    thumbnail: string;
}

export interface ChatResponse {
    reply: string;
}

export interface SubstitutionResponse {
    found: boolean;
    original?: string;
    substitute?: string;
    message?: string;
}
