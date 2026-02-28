import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Item, CreateItemInput, UpdateItemInput, PaginatedResponse } from '@/types';

const ITEMS_KEY = ['items'];

export function useItems(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...ITEMS_KEY, { page, limit }],
    queryFn: async (): Promise<PaginatedResponse<Item>> => {
      const { data } = await api.get('/items', {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: [...ITEMS_KEY, id],
    queryFn: async (): Promise<Item> => {
      const { data } = await api.get(`/items/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateItemInput): Promise<Item> => {
      const { data } = await api.post('/items', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateItemInput): Promise<Item> => {
      const { data } = await api.put(`/items/${id}`, input);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
      queryClient.invalidateQueries({ queryKey: [...ITEMS_KEY, variables.id] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
}
