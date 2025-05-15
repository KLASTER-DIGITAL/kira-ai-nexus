
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
  onSaveNote: (noteData: { title: string; content: string; tags: string[] }) => void;
  onConfirmDelete: () => void;
  onNoteSelect: (noteId: string) => void;
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
      />

      {/* Delete Confirmation Dialog */}
      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={onConfirmDelete}
        noteTitle={activeNote?.title}
      />
    </>
  );
};

export default NotesDialogs;
