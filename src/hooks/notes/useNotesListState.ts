
import { useState } from "react";
import { Note } from "@/types/notes";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SortOption, GroupByOption } from "@/hooks/notes/types";
import { supabase } from "@/integrations/supabase/client";

export const useNotesListState = () => {
  // Local state for UI management
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  
  // Load user preferences from localStorage
  const [sortOption, setSortOption] = useLocalStorage<SortOption>(
    "notes-sort-option", 
    "created_desc"
  );
  const [groupByOption, setGroupByOption] = useLocalStorage<GroupByOption>(
    "notes-group-by", 
    "none"
  );
  
  const { toast } = useToast();

  // Use our notes hook with pagination and sorting
  const { 
    notes, 
    isLoading, 
    createNote, 
    updateNote, 
    deleteNote, 
    totalPages, 
    totalCount 
  } = useNotes({
    filter: {
      searchText: searchText || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    },
    page: currentPage,
    pageSize,
    sort: sortOption
  });
  
  // Handle opening the editor for a new note
  const handleNewNote = () => {
    setActiveNote(undefined);
    setIsEditorOpen(true);
  };

  // Handle editing a note
  const handleEditNote = (note: Note) => {
    setActiveNote(note);
    setIsEditorOpen(true);
  };

  // Handle saving a note (both new and edit)
  const handleSaveNote = (noteData: { title: string; content: string; tags: string[] }) => {
    if (activeNote) {
      // Update existing note
      updateNote({
        id: activeNote.id,
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
      });
    } else {
      // Create new note
      createNote({
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
      });
    }
    setIsEditorOpen(false);
  };

  // Handle opening the delete confirmation dialog
  const handleDeletePrompt = (noteId: string) => {
    const note = notes?.find((n) => n.id === noteId);
    if (note) {
      setActiveNote(note);
      setIsDeleteDialogOpen(true);
    }
  };

  // Handle confirming note deletion
  const handleConfirmDelete = () => {
    if (activeNote) {
      deleteNote(activeNote.id);
    }
    setIsDeleteDialogOpen(false);
  };

  // Handle note selection via wiki links
  const handleNoteSelect = (noteId: string) => {
    const selectedNote = notes?.find((note) => note.id === noteId);
    if (selectedNote) {
      handleEditNote(selectedNote);
    }
  };
  
  // Extract all unique tags from notes
  const allTags = notes ? [...new Set(notes.flatMap(note => note.tags || []))] : [];

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText("");
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

  // Setup realtime subscription
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('notes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'nodes', filter: "type=eq.note" }, 
        (payload) => {
          console.log('Notes change detected:', payload);
          if (payload.eventType === 'INSERT' && payload.new) {
            toast({
              title: "Новая заметка",
              description: "Кто-то добавил новую заметку",
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            toast({
              title: "Заметка обновлена",
              description: "Заметка была обновлена",
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            toast({
              title: "Заметка удалена",
              description: "Заметка была удалена",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    // State
    notes,
    isLoading,
    isEditorOpen,
    setIsEditorOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeNote,
    searchText,
    setSearchText,
    selectedTags,
    currentPage,
    setCurrentPage,
    pageSize,
    sortOption,
    setSortOption,
    groupByOption,
    setGroupByOption,
    totalPages,
    totalCount,
    allTags,
    hasActiveFilters,

    // Handlers
    handleNewNote,
    handleEditNote,
    handleDeletePrompt,
    handleSaveNote,
    handleConfirmDelete,
    handleNoteSelect,
    toggleTag,
    clearFilters,
    setupRealtimeSubscription
  };
};
