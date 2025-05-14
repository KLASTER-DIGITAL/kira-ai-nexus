
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesHeaderProps {
  onNewNote: () => void;
}

const NotesHeader: React.FC<NotesHeaderProps> = ({ onNewNote }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium">Мои заметки</h3>
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
        onClick={onNewNote}
      >
        <Plus size={14} />
        <span>Новая заметка</span>
        <span className="ml-1 hotkey-indicator">Alt+N</span>
      </Button>
    </div>
  );
};

export default NotesHeader;
