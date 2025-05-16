
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Note } from "@/types/notes";
import NoteEditorContainer from "../editor/NoteEditorContainer";
import { toast } from "sonner";

interface NoteSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeNote?: Note;
  isNew?: boolean;
  onSaveNote: (noteData: { title: string; content: string; tags: string[] }) => Promise<boolean>;
  onUpdateNote: (note: Note) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onNoteSelect?: (noteId: string) => void;
}

const NoteSidebar: React.FC<NoteSidebarProps> = ({
  open,
  onOpenChange,
  activeNote,
  isNew = false,
  onSaveNote,
  onUpdateNote,
  onDeleteNote,
  onNoteSelect
}) => {
  const handleSave = async (noteData: { title: string; content: string; tags: string[] }) => {
    try {
      const success = await onSaveNote(noteData);
      if (success) {
        // Close the sidebar on successful save
        onOpenChange(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Не удалось сохранить заметку");
      return false;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg p-0 overflow-y-auto">
        <div className="h-full flex flex-col">
          <div className="flex-grow p-4 overflow-y-auto">
            <NoteEditorContainer
              note={activeNote}
              onSave={handleSave}
              onCancel={() => onOpenChange(false)}
              isNew={isNew}
              onNoteSelect={onNoteSelect}
              onUpdateNote={onUpdateNote}
              onDeleteNote={onDeleteNote}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NoteSidebar;
