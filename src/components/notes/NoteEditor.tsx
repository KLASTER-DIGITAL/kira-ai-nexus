
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { useNoteLinks } from "@/hooks/notes/links/useNoteLinks";
import NoteMetadataComponent from "./editor/NoteMetadata";
import NoteContent from "./editor/NoteContent";
import NoteEditorActions from "./editor/NoteEditorActions";
import { LocalGraphView } from "@/components/graph";
import { toast } from "sonner";

interface NoteEditorProps {
  note?: Note;
  onUpdateNote?: (note: Note) => Promise<void>;
  onDeleteNote?: (noteId: string) => Promise<void>;
  isNew?: boolean;
  onCancel?: () => void;
  onNoteSelect?: (noteId: string) => void;
  onSave: (noteData: { title: string; content: string; tags: string[] }) => void;
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
  const [color, setColor] = useState(note?.color || "");
  const [isSaving, setIsSaving] = useState(false);
  
  const { links } = useNoteLinks(note?.id);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
      setColor(note.color || "");
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
      toast.error("Заголовок не может быть пустым");
      return;
    }
    
    try {
      setIsSaving(true);
      console.log("Сохраняем заметку:", { title, content, tags });
      
      await onSave({
        title,
        content,
        tags
      });
      
      toast.success(isNew ? "Заметка создана" : "Заметка сохранена");
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
      toast.error("Не удалось сохранить заметку");
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
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <NoteContent
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

export default NoteEditor;
