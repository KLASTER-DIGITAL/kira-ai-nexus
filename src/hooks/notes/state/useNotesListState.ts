
import { useNotes } from "@/hooks/notes/useNotesQuery";
import { Note } from "@/types/notes";
import { useNotesFilters } from "./useNotesFilters";
import { useNotesDialogs } from "./useNotesDialogs";
import { useNotesMutation } from "./useNotesMutation";
import { useNotesNavigation } from "./useNotesNavigation";
import { useNotesRealtime } from "./useNotesRealtime";
import { extractUniqueTags } from "./utils";
import { useNotesMutations } from "../useNotesMutations";

/**
 * Main hook for managing note list state
 * Combines multiple specialized hooks
 */
export const useNotesListState = () => {
  // Use specialized hooks
  const filters = useNotesFilters();
  const dialogs = useNotesDialogs();
  const realtime = useNotesRealtime();
  
  // Use the notes query with filters
  const { 
    notes, 
    isLoading,
    totalPages, 
    totalCount 
  } = useNotes({
    filter: {
      searchText: filters.searchText || undefined,
      tags: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
    },
    page: filters.currentPage,
    pageSize: filters.pageSize,
    sort: filters.sortOption
  });
  
  // Set up mutations
  const mutations = useNotesMutation();
  const { updateNote: apiUpdateNote, deleteNote: apiDeleteNote } = useNotesMutations();
  
  // Set up navigation
  const navigation = useNotesNavigation();
  
  // Extract all unique tags from notes
  const allTags = extractUniqueTags(notes);

  // Handle saving notes
  const handleSaveNote = async (noteData: { title: string; content: string; tags: string[] }) => {
    const result = await mutations.handleSaveNote(noteData, dialogs.activeNote);
    return result;
  };

  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    const result = await mutations.handleConfirmDelete(dialogs.activeNote);
    return result;
  };

  // Handle note selection - this function will navigate to the note
  const handleNoteSelect = (noteId: string) => {
    navigation.navigateToNote(noteId);
  };

  // Direct access to mutation functions for component usage
  const updateNote = async (note: Note): Promise<void> => {
    if (!note?.id) return;
    try {
      await apiUpdateNote({
        noteId: note.id,
        noteData: {
          title: note.title,
          content: typeof note.content === 'string' ? note.content : note.content?.text || '',
          tags: note.tags || []
        }
      });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };
  
  const deleteNote = async (noteId: string): Promise<void> => {
    try {
      await apiDeleteNote(noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return {
    // State
    notes,
    isLoading,
    isEditorOpen: dialogs.isEditorOpen,
    setIsEditorOpen: dialogs.setIsEditorOpen,
    isDeleteDialogOpen: dialogs.isDeleteDialogOpen,
    setIsDeleteDialogOpen: dialogs.setIsDeleteDialogOpen,
    activeNote: dialogs.activeNote,
    searchText: filters.searchText,
    setSearchText: filters.setSearchText,
    selectedTags: filters.selectedTags,
    currentPage: filters.currentPage,
    setCurrentPage: filters.setCurrentPage,
    pageSize: filters.pageSize,
    sortOption: filters.sortOption,
    setSortOption: filters.setSortOption,
    groupByOption: filters.groupByOption,
    setGroupByOption: filters.setGroupByOption,
    totalPages,
    totalCount,
    allTags,
    hasActiveFilters: filters.hasActiveFilters,

    // Handlers
    handleNewNote: dialogs.handleNewNote,
    handleEditNote: dialogs.handleEditNote,
    handleDeletePrompt: (noteId: string) => dialogs.handleDeletePrompt(noteId)(notes),
    handleSaveNote,
    handleConfirmDelete,
    handleNoteSelect,
    toggleTag: filters.toggleTag,
    clearFilters: filters.clearFilters,
    setupRealtimeSubscription: realtime.setupRealtimeSubscription,
    
    // Direct mutation functions
    updateNote,
    deleteNote
  };
};
