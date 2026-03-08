import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type NoteInput, type NoteUpdateInput } from "@shared/routes";
import { z } from "zod";

// Helper to safely parse API responses and log errors for debugging
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw new Error(`Invalid response format from ${label}`);
  }
  return result.data;
}

export function useNotes() {
  return useQuery({
    queryKey: [api.notes.list.path],
    queryFn: async () => {
      const res = await fetch(api.notes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      return parseWithLogging(api.notes.list.responses[200], data, "notes.list");
    },
  });
}

export function useNote(id: number) {
  return useQuery({
    queryKey: [api.notes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.notes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch note');
      const data = await res.json();
      return parseWithLogging(api.notes.get.responses[200], data, "notes.get");
    },
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: NoteInput) => {
      const validated = api.notes.create.input.parse(data);
      const res = await fetch(api.notes.create.path, {
        method: api.notes.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = parseWithLogging(api.notes.create.responses[400], await res.json(), "notes.create.error");
          throw new Error(error.message);
        }
        throw new Error('Failed to create note');
      }
      const resData = await res.json();
      return parseWithLogging(api.notes.create.responses[201], resData, "notes.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & NoteUpdateInput) => {
      const validated = api.notes.update.input.parse(updates);
      const url = buildUrl(api.notes.update.path, { id });
      const res = await fetch(url, {
        method: api.notes.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = parseWithLogging(api.notes.update.responses[400], await res.json(), "notes.update.error");
          throw new Error(error.message);
        }
        if (res.status === 404) throw new Error('Note not found');
        throw new Error('Failed to update note');
      }
      const resData = await res.json();
      return parseWithLogging(api.notes.update.responses[200], resData, "notes.update");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.notes.delete.path, { id });
      const res = await fetch(url, { 
        method: api.notes.delete.method, 
        credentials: "include" 
      });
      if (res.status === 404) throw new Error('Note not found');
      if (!res.ok) throw new Error('Failed to delete note');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
    },
  });
}
