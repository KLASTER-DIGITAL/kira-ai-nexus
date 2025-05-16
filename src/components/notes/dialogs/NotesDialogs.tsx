
import React from "react";
import { Note } from "@/types/notes";
import NoteEditDialog from "../NoteEditDialog";
import DeleteNoteDialog from "../DeleteNoteDialog";

interface NotesDialogsProps {
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  activeNote?: Note;
  onSaveNote: (noteData: { title: string; content: string; tags: string[] }) => Promise<boolean>;
  onConfirmDelete: () => Promise<boolean>;
  onNoteSelect: (noteId: string) => void;
  onUpdateNote: (note: Note) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

const NotesDialogs: React.FC<NotesDialogsProps> = ({
  isEditorOpen,
  setIsEditorOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  activeNote,
  onSaveNote,
  onConfirmDelete,
  onNoteSelect,
  onUpdateNote,
  onDeleteNote
}) => {
  return (
    <>
      {/* Note Editor Dialog */}
      <NoteEditDialog
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        activeNote={activeNote}
        onSaveNote={onSaveNote}
        onNoteSelect={onNoteSelect}
        onUpdateNote={onUpdateNote}
        onDeleteNote={onDeleteNote}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={async () => {
          const success = await onConfirmDelete();
          if (success) {
            setIsDeleteDialogOpen(false);
          }
          return success;
        }}
        noteTitle={activeNote?.title}
      />
    </>
  );
};

export default NotesDialogs;
