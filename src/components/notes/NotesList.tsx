
import React, { useState, useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/notes";
import DeleteNoteDialog from "./DeleteNoteDialog";
import NoteEditDialog from "./NoteEditDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SortOption, GroupByOption } from "@/hooks/notes/types";
import { useNotesGrouping } from "@/hooks/notes/useNotesGrouping";
import { useLocalStorage } from "@/hooks/use-local-storage";
import NotesHeader from "./header/NotesHeader";
import FilterBar from "./filters/FilterBar";
import NotesContent from "./content/NotesContent";
import NotesPagination from "./pagination/NotesPagination";
import { useNotesKeyboardShortcuts } from "@/hooks/notes/useNotesKeyboardShortcuts";

const NotesList: React.FC = () => {
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
  
  // Use our notes grouping hook
  const noteGroups = useNotesGrouping(notes || [], groupByOption);

  // Set up keyboard shortcuts
  useNotesKeyboardShortcuts({
    onNewNote: handleNewNote,
    isEditorOpen,
    onCloseEditor: () => setIsEditorOpen(false),
    onNextPage: () => {
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    },
    onPrevPage: () => {
      if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    },
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('notes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'nodes', filter: "type=eq.note" }, 
        (payload) => {
          console.log('Notes change detected:', payload);
          // We'll let React Query handle the cache update via invalidation
          // just show a toast to inform the user
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
  }, [toast]);

  // Handle opening the editor for a new note
  function handleNewNote() {
    setActiveNote(undefined);
    setIsEditorOpen(true);
  }

  // Handle editing a note
  function handleEditNote(note: Note) {
    setActiveNote(note);
    setIsEditorOpen(true);
  }

  // Handle saving a note (both new and edit)
  function handleSaveNote(noteData: { title: string; content: string; tags: string[] }) {
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
  }

  // Handle opening the delete confirmation dialog
  function handleDeletePrompt(noteId: string) {
    const note = notes?.find((n) => n.id === noteId);
    if (note) {
      setActiveNote(note);
      setIsDeleteDialogOpen(true);
    }
  }

  // Handle confirming note deletion
  function handleConfirmDelete() {
    if (activeNote) {
      deleteNote(activeNote.id);
    }
    setIsDeleteDialogOpen(false);
  }

  // Handle note selection via wiki links
  function handleNoteSelect(noteId: string) {
    const selectedNote = notes?.find((note) => note.id === noteId);
    if (selectedNote) {
      handleEditNote(selectedNote);
    }
  }

  // Extract all unique tags from notes
  const allTags = React.useMemo(() => {
    if (!notes) return [];
    const tagSet = new Set<string>();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [notes]);

  // Toggle tag selection
  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  // Clear all filters
  function clearFilters() {
    setSearchText("");
    setSelectedTags([]);
    setCurrentPage(1);
  }

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

  return (
    <div>
      <NotesHeader onNewNote={handleNewNote} />

      <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        clearFilters={clearFilters}
        allTags={allTags}
        sortOption={sortOption}
        setSortOption={setSortOption}
        groupByOption={groupByOption}
        setGroupByOption={setGroupByOption}
      />

      <NotesContent 
        notes={notes || []}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        groupByOption={groupByOption}
        noteGroups={noteGroups}
        onEdit={handleEditNote}
        onDelete={handleDeletePrompt}
        onNewNote={handleNewNote}
        onClearFilters={clearFilters}
        totalCount={totalCount}
      />

      {totalPages > 1 && (
        <NotesPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Note Editor Dialog */}
      <NoteEditDialog
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        activeNote={activeNote}
        onSaveNote={handleSaveNote}
        onNoteSelect={handleNoteSelect}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
        noteTitle={activeNote?.title}
      />
    </div>
  );
};

export default NotesList;
