
import React from "react";
import { Note } from "@/types/notes";
import NoteEditorContainer from "./editor/NoteEditorContainer";
import { toast } from "sonner";

interface NoteEditorProps {
  note?: Note;
  onUpdateNote?: (note: Note) => Promise<void>;
  onDeleteNote?: (noteId: string) => Promise<void>;
  isNew?: boolean;
  onCancel?: () => void;
  onNoteSelect?: (noteId: string) => void;
  onSave: (noteData: { title: string; content: string; tags: string[] }) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  onSave, 
  onCancel, 
  isNew = false,
  onNoteSelect,
  onUpdateNote,
  onDeleteNote
}) => {
  // Wrap onSave with toast notifications
  const handleSave = async (noteData: { title: string; content: string; tags: string[] }) => {
    try {
      await onSave(noteData);
      toast.success(isNew ? "Заметка создана" : "Заметка сохранена");
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
      toast.error("Не удалось сохранить заметку");
      return false;
    }
  };

  return (
    <NoteEditorContainer
      note={note}
      onSave={handleSave}
      onCancel={onCancel}
      isNew={isNew}
      onNoteSelect={onNoteSelect}
      onUpdateNote={onUpdateNote}
      onDeleteNote={onDeleteNote}
    />
  );
};

export default NoteEditor;
