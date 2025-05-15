
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";

interface NoteEditorActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  isNew: boolean;
  hasTitle: boolean;
}

const NoteEditorActions: React.FC<NoteEditorActionsProps> = ({
  onCancel,
  onSave,
  isSaving,
  isNew,
  hasTitle,
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={onCancel}
        size="sm"
        className="flex items-center"
      >
        <X className="mr-1 h-4 w-4" />
        <span>Отмена</span>
      </Button>
      <Button
        onClick={onSave}
        size="sm"
        disabled={!hasTitle || isSaving}
        className="flex items-center"
      >
        <Save className="mr-1 h-4 w-4" />
        <span>{isNew ? "Создать" : "Сохранить"}</span>
      </Button>
    </div>
  );
};

export default NoteEditorActions;
