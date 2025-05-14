import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { X, Save, Tags, ArrowLeft } from "lucide-react";
import TipTapEditor from "./TipTapEditor";
import { Badge } from "@/components/ui/badge";
import { useNoteLinks } from "@/hooks/notes/useNoteLinks";
import BacklinksList from "./BacklinksList";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

interface NoteEditorProps {
  note?: Note;
  onSave: (note: { title: string; content: string; tags: string[] }) => void;
  onCancel: () => void;
  isNew?: boolean;
  onNoteSelect?: (noteId: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel,
  isNew = false,
  onNoteSelect
}) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const { links } = useNoteLinks(note?.id);
  const hasBacklinks = links?.incomingLinks && links.incomingLinks.length > 0;

  // Debounce changes for autosave
  const debouncedTitle = useDebounce(title, 1500);
  const debouncedContent = useDebounce(content, 1500);
  const debouncedTags = useDebounce(tags, 1500);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
    }
  }, [note]);

  // Autosave effect
  useEffect(() => {
    if (!isNew && note && (debouncedTitle || debouncedContent)) {
      const hasChanges = 
        debouncedTitle !== note.title || 
        debouncedContent !== note.content || 
        JSON.stringify(debouncedTags) !== JSON.stringify(note.tags);
        
      if (hasChanges && debouncedTitle.trim()) {
        handleAutosave();
      }
    }
  }, [debouncedTitle, debouncedContent, debouncedTags]);

  const handleAutosave = useCallback(() => {
    if (!title.trim() || isNew) return;
    
    setIsSaving(true);
    
    try {
      onSave({
        title,
        content,
        tags
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
  }, [title, content, tags, isNew, onSave]);

  const handleManualSave = () => {
    if (!title.trim()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      onSave({
        title,
        content,
        tags
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

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      addTag();
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
          <div className="flex items-center gap-2 mb-2">
            <Tags className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Теги:</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <TagBadge 
                key={index} 
                tag={tag} 
                variant="colored"
                onRemove={() => removeTag(tag)} 
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Добавить тег..."
              className="text-sm"
              onKeyPress={handleKeyPress}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addTag} 
              disabled={!tagInput.trim()}
            >
              Добавить
            </Button>
          </div>
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
