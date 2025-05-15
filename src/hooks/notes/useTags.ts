
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTags = () => {
  const { data: tags, isLoading, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      // Get all notes with tags
      const { data, error } = await supabase
        .from('nodes')
        .select('content')
        .eq('type', 'note')
        .not('content', 'is', null);

      if (error) {
        console.error('Error fetching tags:', error);
        return [];
      }

      // Extract unique tags from all notes
      const allTags = data.reduce((acc: string[], note) => {
        const content = note.content as any;
        const tags = Array.isArray(content?.tags) ? content.tags : [];
        return [...acc, ...tags];
      }, []);

      // Return unique tags
      return [...new Set(allTags)];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    tags: tags || [],
    isLoading,
    error,
  };
};
