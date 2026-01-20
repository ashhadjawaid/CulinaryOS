import api from '../lib/api';
import type { Order, VideoResult, ChatResponse, SubstitutionResponse } from '../types/order';

// Removed local axios instance and interceptor to use shared 'api' instance
// which is managed by AuthContext for authentication headers.

export const getOrders = async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
};

export const createOrder = async (orderData: Partial<Order>) => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
};

export const updateOrder = async (id: string, orderData: Partial<Order>) => {
    const response = await api.put<Order>(`/orders/${id}`, orderData);
    return response.data;
};

export const deleteOrder = async (id: string) => {
    const response = await api.delete<{ message: string }>(`/orders/${id}`);
    return response.data;
};

// AI & Video Services
export const searchVideos = async (query: string) => {
    const response = await api.get<VideoResult[]>(`/ai/videos?query=${query}`);
    return response.data;
};

export const chatWithIChef = async (message: string) => {
    const response = await api.post<ChatResponse>('/ai/chat', { message });
    return response.data;
};

export const getAiRecipeSuggestion = async () => {
    const response = await api.post<{ suggestion: string }>('/ai/suggest');
    return response.data;
};

export const getSubstitution = async (ingredient: string) => {
    const response = await api.post<SubstitutionResponse>('/ai/substitute', { ingredient });
    return response.data;
};
