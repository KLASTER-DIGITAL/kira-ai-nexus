
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
import { transformNoteData } from "./utils";
import { NoteFilter, SortOption, NotesQueryOptions } from "./types";

export interface PaginatedNotesResult {
  notes: Note[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const NOTES_PAGE_SIZE = 12;

export const useNotesQuery = (options: NotesQueryOptions = {}) => {
  const { filter, page = 1, pageSize = NOTES_PAGE_SIZE, sort = 'created_desc' } = options;

  return useQuery({
    queryKey: ["notes", filter, page, pageSize, sort],
    queryFn: async (): Promise<PaginatedNotesResult> => {
      console.log("Загрузка заметок с параметрами:", { filter, page, pageSize, sort });
      
      // Проверяем авторизацию пользователя
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        console.error("Ошибка авторизации:", authError || "Пользователь не авторизован");
        throw new Error("Требуется авторизация для загрузки заметок");
      }

      let query = supabase
        .from("nodes")
        .select("*", { count: "exact" })
        .eq("type", "note")
        .eq("user_id", authData.user.id); // Добавлена явная фильтрация по user_id

      // Apply tag filter
      if (filter?.tags && filter.tags.length > 0) {
        query = query.contains("tags", filter.tags);
      }

      // Fix the or() method call - Supabase's or method expects a string with filter conditions
      if (filter?.searchText) {
        const searchTerm = filter.searchText.toLowerCase();
        query = query.or(`title.ilike.%${searchTerm}%,content->text.ilike.%${searchTerm}%`);
      }

      // Apply sorting
      switch (sort) {
        case 'created_asc':
          query = query.order("created_at", { ascending: true });
          break;
        case 'updated_desc':
          query = query.order("updated_at", { ascending: false });
          break;
        case 'title_asc':
          query = query.order("title", { ascending: true });
          break;
        case 'title_desc':
          query = query.order("title", { ascending: false });
          break;
        case 'created_desc':
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      query = query.range(startIndex, startIndex + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("Ошибка при загрузке заметок:", error);
        throw error;
      }

      console.log("Полученные данные заметок:", data);
      
      // Transform the raw data to match the Note type
      const notes = data ? data.map(transformNoteData) : [];
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      console.log(`Загружено ${notes.length} заметок из ${totalCount} всего`);

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
