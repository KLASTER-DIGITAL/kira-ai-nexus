
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
import { transformNoteData } from "./utils";
import { NoteFilter } from "./types";

interface NotesQueryOptions {
  filter?: NoteFilter;
  page?: number;
  pageSize?: number;
}

export interface PaginatedNotesResult {
  notes: Note[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const NOTES_PAGE_SIZE = 12;

export const useNotesQuery = (options: NotesQueryOptions = {}) => {
  const { filter, page = 1, pageSize = NOTES_PAGE_SIZE } = options;

  return useQuery({
    queryKey: ["notes", filter, page, pageSize],
    queryFn: async (): Promise<PaginatedNotesResult> => {
      let query = supabase
        .from("nodes")
        .select("*", { count: "exact" })
        .eq("type", "note")
        .order("created_at", { ascending: false });

      // Apply tag filter
      if (filter?.tags && filter.tags.length > 0) {
        query = query.contains("tags", filter.tags);
      }

      // Fix the or() method call - Supabase's or method expects a string with filter conditions
      if (filter?.searchText) {
        const searchTerm = filter.searchText.toLowerCase();
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      query = query.range(startIndex, startIndex + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching notes:", error);
        throw error;
      }

      // Transform the raw data to match the Note type
      const notes = data ? data.map(transformNoteData) : [];
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        notes,
        totalCount,
        totalPages,
        currentPage: page
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useNotes = (options: NotesQueryOptions = {}) => {
  const { data, isLoading, error } = useNotesQuery(options);

  return {
    notes: data?.notes || [],
    isLoading,
    error,
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
  };
};
