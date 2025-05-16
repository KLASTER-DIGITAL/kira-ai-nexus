
import { useState } from "react";
import { Note } from "@/types/notes";

/**
 * Hook for managing notes-related dialogs
 */
export const useNotesDialogs = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);

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

  // Handle opening the delete confirmation dialog
  const handleDeletePrompt = (noteId: string) => {
    return (notes?: Note[]) => {
      if (!notes) return;
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setActiveNote(note);
        setIsDeleteDialogOpen(true);
      }
    };
  };

  return {
    isEditorOpen,
    setIsEditorOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeNote,
    setActiveNote,
    handleNewNote,
    handleEditNote,
    handleDeletePrompt
  };
};
