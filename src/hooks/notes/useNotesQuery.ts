import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";

interface Filter {
  searchText?: string;
  tags?: string[];
}

interface Options {
  filter?: Filter;
  page?: number;
  pageSize?: number;
}

const NOTES_PAGE_SIZE = 12;

export const useNotesQuery = (options: Options = {}) => {
  const { filter, page = 1, pageSize = NOTES_PAGE_SIZE } = options;

  return useQuery({
    queryKey: ["notes", filter, page, pageSize],
    queryFn: async (): Promise<Note[]> => {
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

      return data as Note[];
    },
    select: (data) => data as Note[],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useNotes = (options: Options = {}) => {
  const { data, isLoading, error } = useNotesQuery(options);
  const { filter } = options;

  // Fetch total count separately
  const { data: countData, isLoading: isCountLoading } = useQuery({
    queryKey: ["notesCount", filter],
    queryFn: async () => {
      let query = supabase
        .from("nodes")
        .select("*", { count: "exact" })
        .eq("type", "note");

      // Apply tag filter
      if (filter?.tags && filter.tags.length > 0) {
        query = query.contains("tags", filter.tags);
      }

      // Apply search filter
     if (filter?.searchText) {
        const searchTerm = filter.searchText.toLowerCase();
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      const { count, error } = await query;

      if (error) {
        console.error("Error fetching notes count:", error);
        throw error;
      }

      return count;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const totalCount = countData !== null ? countData : 0;
  const totalPages = Math.ceil(totalCount / (options.pageSize || NOTES_PAGE_SIZE));

  return {
    notes: data || [],
    isLoading,
    error,
    totalCount,
    totalPages,
  };
};
