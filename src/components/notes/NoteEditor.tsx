
import React from "react";
import { Note } from "@/types/notes";
import NoteEditorContainer from "./editor/NoteEditorContainer";

interface NoteEditorProps {
  note?: Note;
  onUpdateNote?: (note: Note) => Promise<void>;
  onDeleteNote?: (noteId: string) => Promise<void>;
  isNew?: boolean;
  onCancel?: () => void;
  onNoteSelect?: (noteId: string) => void;
  onSave: (noteData: { title: string; content: string; tags: string[]; color?: string }) => Promise<boolean>;
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
  return (
    <NoteEditorContainer
      note={note}
      onSave={onSave}
      onCancel={onCancel}
      isNew={isNew}
      onNoteSelect={onNoteSelect}
      onUpdateNote={onUpdateNote}
      onDeleteNote={onDeleteNote}
    />
  );
};

export default NoteEditor;
