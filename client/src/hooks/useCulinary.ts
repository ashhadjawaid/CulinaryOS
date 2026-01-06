import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { PantryItem } from '../data/mockPantry';
import type { Recipe } from '../data/mockRecipes';

// Pantry Hooks
export const usePantry = () => {
    return useQuery({
        queryKey: ['pantry'],
        queryFn: async () => {
            const { data } = await api.get<PantryItem[]>('/pantry');
            return data;
        },
    });
};

export const useAddPantryItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (item: Omit<PantryItem, '_id'>) => {
            const { data } = await api.post<PantryItem[]>('/pantry', item);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] });
        },
    });
};

export const useUpdatePantryItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (item: any) => {
            const { data } = await api.put<PantryItem[]>(`/pantry/${item.id}`, item);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] });
        },
    });
};

export const useDeletePantryItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete<PantryItem[]>(`/pantry/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] });
        },
    });
};

// Recipe Hooks
export const useRecipes = () => {
    return useQuery({
        queryKey: ['recipes'],
        queryFn: async () => {
            const { data } = await api.get<Recipe[]>('/recipes');
            return data;
        },
    });
};

export const useAddRecipe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (recipe: any) => {
            const { data } = await api.post('/recipes', recipe);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
};

export const useUpdateRecipe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (recipe: any) => {
            const { data } = await api.put(`/recipes/${recipe._id}`, recipe);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
};

export const useDeleteRecipe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/recipes/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
};

// Planner Hooks
export const useMealPlan = () => {
    return useQuery({
        queryKey: ['mealPlan'],
        queryFn: async () => {
            const { data } = await api.get('/planner');
            return data;
        },
    });
};

export const useUpdateMealPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (meals: any[]) => {
            const { data } = await api.post('/planner', { meals });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
        },
    });
};
