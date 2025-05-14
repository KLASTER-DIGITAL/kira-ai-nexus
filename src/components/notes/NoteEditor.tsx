
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { X, Save } from "lucide-react";
import TipTapEditor from "./TipTapEditor";
import { useNoteLinks } from "@/hooks/notes/useNoteLinks";
import BacklinksList from "./BacklinksList";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import TagManager from "./TagManager";
import ColorPicker from "./ColorPicker";

interface NoteEditorProps {
  note?: Note;
  onSave: (note: { title: string; content: string; tags: string[]; color?: string }) => void;
  onCancel: () => void;
  isNew?: boolean;
  onNoteSelect?: (noteId: string) => void;
  autoSaveDelay?: number;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel,
  isNew = false,
  onNoteSelect,
  autoSaveDelay = 1500
}) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [color, setColor] = useState<string>(note?.color?.replace('bg-', '')?.replace('-100', '') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const { links } = useNoteLinks(note?.id);
  const hasBacklinks = links?.incomingLinks && links.incomingLinks.length > 0;

  // Debounce changes for autosave
  const debouncedTitle = useDebounce(title, autoSaveDelay);
  const debouncedContent = useDebounce(content, autoSaveDelay);
  const debouncedTags = useDebounce(tags, autoSaveDelay);
  const debouncedColor = useDebounce(color, autoSaveDelay);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
      setColor(note.color?.replace('bg-', '')?.replace('-100', '') || '');
    }
  }, [note]);

  // Autosave effect
  useEffect(() => {
    if (!isNew && note && (debouncedTitle || debouncedContent)) {
      const hasChanges = 
        debouncedTitle !== note.title || 
        debouncedContent !== note.content || 
        JSON.stringify(debouncedTags) !== JSON.stringify(note.tags) ||
        (debouncedColor ? `bg-${debouncedColor}-100` : '') !== (note.color || '');
        
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

  const handleWikiLinkClick = (noteId: string) => {
    if (onNoteSelect) {
      onNoteSelect(noteId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <ColorPicker 
            selectedColor={color} 
            onColorChange={setColor} 
          />
        </div>
        
        <TipTapEditor 
          content={content} 
          onChange={setContent} 
          placeholder="Содержание заметки..."
          autoFocus={false}
          noteId={note?.id}
          onLinkClick={handleWikiLinkClick}
        />
        
        {hasBacklinks && (
          <div className="mt-4">
            <BacklinksList links={links?.incomingLinks || []} onLinkClick={handleWikiLinkClick} />
          </div>
        )}
        
        <div className="mt-4">
          <TagManager tags={tags} onTagsChange={setTags} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
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
          onClick={handleManualSave}
          size="sm"
          disabled={!title.trim() || isSaving}
          className="flex items-center"
        >
          <Save className="mr-1 h-4 w-4" />
          <span>{isNew ? "Создать" : "Сохранить"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteEditor;
