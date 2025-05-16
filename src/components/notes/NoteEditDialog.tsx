
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import NoteEditor from "./NoteEditor";
import { Note } from "@/types/notes";

interface NoteEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeNote?: Note;
  onSaveNote: (noteData: { title: string; content: string; tags: string[] }) => Promise<boolean>;
  onNoteSelect?: (noteId: string) => void;
  onUpdateNote: (note: Note) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

const NoteEditDialog: React.FC<NoteEditDialogProps> = ({
  isOpen,
  onOpenChange,
  activeNote,
  onSaveNote,
  onNoteSelect,
  onUpdateNote,
  onDeleteNote
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {activeNote ? "Редактирование заметки" : "Создание заметки"}
          </DialogTitle>
        </DialogHeader>
        <NoteEditor
          note={activeNote}
          onSave={async (noteData) => {
            const result = await onSaveNote(noteData);
            if (result) {
              onOpenChange(false);
            }
            return result;
          }}
          onCancel={() => onOpenChange(false)}
          isNew={!activeNote}
          onNoteSelect={onNoteSelect}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditDialog;
