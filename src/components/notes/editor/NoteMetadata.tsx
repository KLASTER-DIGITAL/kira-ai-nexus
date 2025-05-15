
import React from "react";
import { Input } from "@/components/ui/input";
import ColorPicker from "../ColorPicker";

interface NoteMetadataProps {
  title: string;
  onTitleChange: (title: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  isSaving?: boolean;
  lastSavedAt?: Date | null;
}

const NoteMetadata: React.FC<NoteMetadataProps> = ({
  title,
  onTitleChange,
  color,
  onColorChange,
  isSaving,
  lastSavedAt,
}) => {
  return (
    <div className="flex justify-between items-center">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Заголовок заметки"
        className="font-medium text-lg"
        autoFocus
      />
      <div className="text-sm text-muted-foreground ml-2">
        {isSaving ? (
          <span className="animate-pulse">Сохраняется...</span>
        ) : lastSavedAt ? (
          <span>
            Сохранено: {lastSavedAt.toLocaleTimeString()}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default NoteMetadata;
