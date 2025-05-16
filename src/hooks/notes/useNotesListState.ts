
import { useState, useEffect } from "react";
import { Note } from "@/types/notes";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SortOption, GroupByOption } from "@/hooks/notes/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    console.log("Открываем редактор для создания новой заметки");
    setActiveNote(undefined);
    setIsEditorOpen(true);
  };

  // Handle editing a note
  const handleEditNote = (note: Note) => {
    console.log("Открываем редактор для заметки:", note.title);
    setActiveNote(note);
    setIsEditorOpen(true);
  };

  // Handle saving a note (both new and edit)
  const handleSaveNote = async (noteData: { title: string; content: string; tags: string[] }) => {
    console.log("Сохраняем заметку:", noteData);
    try {
      if (activeNote) {
        // Update existing note
        await updateNote({
          id: activeNote.id,
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags,
          user_id: activeNote.user_id,
          type: activeNote.type
        });
        toast.success("Заметка обновлена");
      } else {
        // Create new note
        const result = await createNote({
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags,
          user_id: "", // Will be filled by backend
          type: "note"
        } as any);
        
        console.log("Заметка создана:", result);
        toast.success("Заметка создана");
      }
      setIsEditorOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
      toast.error("Не удалось сохранить заметку. Попробуйте еще раз.");
    }
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
  const handleConfirmDelete = async () => {
    if (activeNote) {
      try {
        await deleteNote(activeNote.id);
        toast.success("Заметка удалена");
      } catch (error) {
        console.error("Ошибка при удалении заметки:", error);
        toast.error("Не удалось удалить заметку");
      }
    }
    setIsDeleteDialogOpen(false);
  };

  // Handle note selection via wiki links
  const handleNoteSelect = (noteId: string) => {
    console.log("Выбрана заметка по ID:", noteId);
    const selectedNote = notes?.find((note) => note.id === noteId);
    if (selectedNote) {
      handleEditNote(selectedNote);
    } else {
      console.log("Заметка не найдена среди загруженных, загружаем из базы...");
      // Если не найдена в текущем списке, получить заметку напрямую из базы
      supabase
        .from('nodes')
        .select('*')
        .eq('id', noteId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Ошибка загрузки заметки:", error);
            toast.error("Не удалось загрузить заметку");
          } else if (data) {
            // Преобразовать данные в формат Note
            const note: Note = {
              id: data.id,
              title: data.title,
              content: data.content?.text || "",
              tags: data.content?.tags || [],
              color: data.content?.color,
              type: data.type,
              user_id: data.user_id,
              created_at: data.created_at,
              updated_at: data.updated_at
            };
            handleEditNote(note);
          }
        });
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
            toast.info("Новая заметка", {
              description: "Создана новая заметка"
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            toast.info("Заметка обновлена", {
              description: "Заметка была изменена"
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            toast.info("Заметка удалена", {
              description: "Заметка была удалена"
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
