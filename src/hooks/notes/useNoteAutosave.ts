
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

interface UseNoteAutosaveProps {
  title: string;
  content: string;
  tags: string[];
  color: string;
  isNew: boolean;
  initialNote?: {
    title: string;
    content: string;
    tags: string[];
    color?: string;
  };
  onSave: (note: { title: string; content: string; tags: string[]; color?: string }) => void;
  autoSaveDelay?: number;
}

export const useNoteAutosave = ({
  title,
  content,
  tags,
  color,
  isNew,
  initialNote,
  onSave,
  autoSaveDelay = 1500
}: UseNoteAutosaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const { toast } = useToast();
  
  // Debounce changes for autosave
  const debouncedTitle = useDebounce(title, autoSaveDelay);
  const debouncedContent = useDebounce(content, autoSaveDelay);
  const debouncedTags = useDebounce(tags, autoSaveDelay);
  const debouncedColor = useDebounce(color, autoSaveDelay);

  const formatColorForComparison = (colorStr?: string) => {
    return colorStr ? `bg-${colorStr}-100` : '';
  };

  // Autosave effect
  useEffect(() => {
    if (!isNew && initialNote && (debouncedTitle || debouncedContent)) {
      const hasChanges = 
        debouncedTitle !== initialNote.title || 
        debouncedContent !== initialNote.content || 
        JSON.stringify(debouncedTags) !== JSON.stringify(initialNote.tags) ||
        formatColorForComparison(debouncedColor) !== (initialNote.color || '');
        
      if (hasChanges && debouncedTitle.trim()) {
        handleAutosave();
      }
    }
  }, [debouncedTitle, debouncedContent, debouncedTags, debouncedColor]);

  const handleAutosave = useCallback(() => {
    if (!title.trim() || isNew) return;
    
    setIsSaving(true);
    
    try {
      onSave({
        title,
        content,
        tags,
        color: color ? `bg-${color}-100` : undefined
      });
      setLastSavedAt(new Date());
    } catch (error) {
      toast({
        title: "Ошибка автосохранения",
        description: "Не удалось сохранить изменения",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [title, content, tags, color, isNew, onSave]);

  const handleManualSave = () => {
    if (!title.trim()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      onSave({
        title,
        content,
        tags,
        color: color ? `bg-${color}-100` : undefined
      });
      setLastSavedAt(new Date());
      
      if (isNew) {
        toast({
          title: "Заметка создана",
          description: `"${title}" успешно создана`
        });
      } else {
        toast({
          title: "Заметка сохранена",
          description: `"${title}" успешно сохранена`
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    lastSavedAt,
    handleManualSave
  };
};
