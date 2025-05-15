
import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export interface Tag {
  id: string;
  name: string;
}

export const useTags = () => {
  const supabase = useSupabaseClient();
  const [tags, setTags] = useState<string[]>([]);
  
  const { data, isPending, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      // Fetch all unique tags from notes
      const { data, error } = await supabase
        .from('notes')
        .select('tags')
        .not('tags', 'is', null);
      
      if (error) throw error;
      
      // Extract all unique tags from the array of notes
      const allTags = new Set<string>();
      data.forEach(item => {
        if (Array.isArray(item.tags)) {
          item.tags.forEach((tag: string) => allTags.add(tag));
        }
      });
      
      return Array.from(allTags);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    if (data) {
      setTags(data);
    }
  }, [data]);
  
  return {
    tags,
    isLoading: isPending,
    error
  };
};
