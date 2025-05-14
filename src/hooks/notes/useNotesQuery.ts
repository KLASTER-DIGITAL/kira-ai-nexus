
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { Note } from "@/types/notes";
import { NoteFilter } from "./types";
import { transformNoteData } from "./utils";

export const useNotesQuery = (filter?: NoteFilter) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notes', filter],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('nodes')
        .select('*')
        .eq('type', 'note')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (filter?.searchText) {
        const searchTerm = filter.searchText.toLowerCase();
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
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
      
      return notesWithTags as Note[];
    },
    enabled: !!user,
  });
};
