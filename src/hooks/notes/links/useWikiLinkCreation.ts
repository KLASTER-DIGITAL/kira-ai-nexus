
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "./linksApi";
import { useNotes } from "@/hooks/useNotes";

export const useWikiLinkCreation = (currentNoteId?: string) => {
  const queryClient = useQueryClient();
  const { notes } = useNotes({ pageSize: 100 });

  // Mutation for creating a new link
  const linkMutation = useMutation({
    mutationFn: async ({ sourceId, targetId }: { sourceId: string; targetId: string }) => {
      return await createLink(sourceId, targetId);
    },
    onSuccess: () => {
      // Invalidate the links cache for the current note
      if (currentNoteId) {
        queryClient.invalidateQueries({ queryKey: ['noteLinks', currentNoteId] });
      }
    }
  });

  // Function to create a link between the current note and another note by title
  const createWikiLink = async (title: string): Promise<void> => {
    if (!currentNoteId || !title) return;
    
    // Find the target note by title
    const targetNote = notes?.find(note => 
      note.title.toLowerCase() === title.toLowerCase()
    );
    
    // If the target note exists, create the link
    if (targetNote) {
      await linkMutation.mutateAsync({
        sourceId: currentNoteId,
        targetId: targetNote.id
      });
    }
  };

  return {
    createWikiLink,
    isCreatingLink: linkMutation.isPending
  };
};
