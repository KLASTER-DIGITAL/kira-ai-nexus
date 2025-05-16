
import React from "react";
import { Input } from "@/components/ui/input";
import ColorPicker from "@/components/notes/ColorPicker";

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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Заголовок заметки"
          className="font-medium text-lg"
          autoFocus
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <ColorPicker selectedColor={color} onColorChange={onColorChange} />
        </div>
        <div className="text-xs text-muted-foreground">
          {isSaving ? (
            <span className="animate-pulse">Сохраняется...</span>
          ) : lastSavedAt ? (
            <span>
              Сохранено: {lastSavedAt.toLocaleTimeString()}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NoteMetadata;
