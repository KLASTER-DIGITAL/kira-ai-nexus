
import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/notes";
import FilterBar from "./filters/FilterBar";
import EmptyState from "./EmptyState";
import NoteCardGrid from "./NoteCardGrid";
import DeleteNoteDialog from "./DeleteNoteDialog";
import NoteEditDialog from "./NoteEditDialog";

const NotesList: React.FC = () => {
  // Local state for UI management
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Use our notes hook
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes({
    searchText: searchText || undefined,
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

  // Extract all unique tags from notes
  const allTags = useMemo(() => {
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
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter notes by selected tags
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (selectedTags.length === 0) return notes;
    
    return notes.filter(note => {
      if (!note.tags || note.tags.length === 0) return false;
      return selectedTags.some(tag => note.tags.includes(tag));
    });
  }, [notes, selectedTags]);

  // Clear all filters
  const clearFilters = () => {
    setSearchText("");
    setSelectedTags([]);
  };

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Мои заметки</h3>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleNewNote}
        >
          <Plus size={14} />
          <span>Новая заметка</span>
        </Button>
      </div>

      <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        clearFilters={clearFilters}
        allTags={allTags}
      />

      {isLoading ? (
        <div className="flex justify-center my-10">
          <p>Загрузка заметок...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          hasFilters={hasActiveFilters}
          onCreateNew={handleNewNote}
          onClearFilters={clearFilters}
        />
      ) : (
        <NoteCardGrid
          notes={filteredNotes}
          onEdit={handleEditNote}
          onDelete={handleDeletePrompt}
        />
      )}

      {/* Note Editor Dialog */}
      <NoteEditDialog
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        activeNote={activeNote}
        onSaveNote={handleSaveNote}
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
