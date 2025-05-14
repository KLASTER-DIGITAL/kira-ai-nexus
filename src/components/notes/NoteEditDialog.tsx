
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
  onSaveNote: (noteData: { title: string; content: string; tags: string[] }) => void;
}

const NoteEditDialog: React.FC<NoteEditDialogProps> = ({
  isOpen,
  onOpenChange,
  activeNote,
  onSaveNote,
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
          onSave={onSaveNote}
          onCancel={() => onOpenChange(false)}
          isNew={!activeNote}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditDialog;
