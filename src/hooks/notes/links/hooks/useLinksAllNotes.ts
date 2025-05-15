
import { useQuery } from "@tanstack/react-query";
import { fetchAllNotes } from "../api";

/**
 * Hook for fetching all notes for link suggestions
 */
export const useLinksAllNotes = () => {
  return useQuery({
    queryKey: ['allNotes'],
    queryFn: fetchAllNotes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
