
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { Note } from "@/types/notes";
import { NoteFilter } from "./types";
import { transformNoteData } from "./utils";

export interface NotesQueryOptions {
  filter?: NoteFilter;
  page?: number;
  pageSize?: number;
}

export const useNotesQuery = ({ filter, page = 1, pageSize = 10 }: NotesQueryOptions = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notes', filter, page, pageSize],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate pagination range
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('nodes')
        .select('*, count(*) OVER() as total_count', { count: 'exact' })
        .eq('type', 'note')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .range(from, to);
        
      if (filter?.searchText) {
        const searchTerm = filter.searchText.toLowerCase();
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (filter?.tags && filter.tags.length > 0) {
        // Filter notes by tags (using containment operator)
        const containsAllTags = filter.tags.map(tag => 
          `content->>'tags' @> '["${tag}"]'::jsonb`
        ).join(' AND ');
        
        query = query.filter(containsAllTags);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        toast({
          title: "Ошибка загрузки заметок",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // Transform the data to ensure tags field exists
      const notesWithTags = data.map(note => transformNoteData(note));
      
      return {
        notes: notesWithTags as Note[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page
      };
    },
    enabled: !!user,
  });
};
