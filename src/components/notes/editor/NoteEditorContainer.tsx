
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { useNoteLinks } from "@/hooks/notes/links/useNoteLinks";
import NoteMetadataComponent from "./NoteMetadata";
import NoteContentEditor from "./NoteContentEditor";
import NoteEditorActions from "./NoteEditorActions";
import { LocalGraphView } from "@/components/graph";

interface NoteEditorContainerProps {
  note?: Note;
  onUpdateNote?: (note: Note) => Promise<void>;
  onDeleteNote?: (noteId: string) => Promise<void>;
  isNew?: boolean;
  onCancel?: () => void;
  onNoteSelect?: (noteId: string) => void;
  onSave: (noteData: { title: string; content: string; tags: string[] }) => Promise<boolean>;
}

const NoteEditorContainer: React.FC<NoteEditorContainerProps> = ({ 
  note, 
  onSave, 
  onCancel, 
  isNew = false,
  onNoteSelect,
  onUpdateNote,
  onDeleteNote
}) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [color, setColor] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  
  const { links } = useNoteLinks(note?.id);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      
      // Правильно обрабатываем контент заметки в зависимости от его структуры
      if (typeof note.content === 'string') {
        setContent(note.content || "");
        setTags(note.tags || []);
        setColor(note.color || "");
      } else if (note.content && typeof note.content === 'object') {
        // Если content - это объект, извлекаем текст, теги и цвет
        setContent(note.content.text || "");
        setTags(Array.isArray(note.content.tags) ? note.content.tags : (note.tags || []));
        setColor(note.content.color || note.color || "");
      } else {
        // Если content отсутствует или null, используем пустую строку
        setContent("");
        setTags(note.tags || []);
        setColor(note.color || "");
      }
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setColor("");
    }
  }, [note]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return false;
    }
    
    try {
      setIsSaving(true);
      console.log("Сохраняем заметку:", { title, content, tags });
      
      const success = await onSave({
        title,
        content, // Передаем текст контента
        tags     // Теги передаются отдельно
      });
      
      if (success) {
        setLastSavedAt(new Date());
      }
      
      return success;
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <NoteMetadataComponent
          title={title}
          onTitleChange={handleTitleChange}
          color={color}
          onColorChange={handleColorChange}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <NoteContentEditor
          content={content}
          onContentChange={handleContentChange}
          noteId={note?.id}
          onNoteSelect={onNoteSelect}
          tags={tags}
          onTagsChange={handleTagsChange}
          color={color}
          onColorChange={handleColorChange}
          links={links}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <NoteEditorActions
          isNew={isNew}
          onSave={handleSave}
          onCancel={onCancel || (() => {})}
          isSaving={isSaving}
          hasTitle={title.trim().length > 0}
        />
      </CardFooter>
      {note?.id && <LocalGraphView nodeId={note.id} onNodeClick={onNoteSelect} />}
    </Card>
  );
};

export default NoteEditorContainer;
