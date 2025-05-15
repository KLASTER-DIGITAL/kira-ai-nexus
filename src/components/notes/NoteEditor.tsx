
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { useNoteLinks } from "@/hooks/notes/useNoteLinks";
import { useNoteAutosave } from "@/hooks/notes/useNoteAutosave";
import NoteMetadata from "./editor/NoteMetadata";
import NoteContent from "./editor/NoteContent";
import NoteEditorActions from "./editor/NoteEditorActions";

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
  
  const { links } = useNoteLinks(note?.id);
  
  const { isSaving, lastSavedAt, handleManualSave } = useNoteAutosave({
    title,
    content,
    tags,
    color,
    isNew,
    initialNote: note,
    onSave,
    autoSaveDelay
  });

  // Sync with props when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
      setColor(note.color?.replace('bg-', '')?.replace('-100', '') || '');
    }
  }, [note]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <NoteMetadata
          title={title}
          onTitleChange={setTitle}
          color={color}
          onColorChange={setColor}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
        />
      </CardHeader>
      <CardContent>
        <NoteContent
          content={content}
          onContentChange={setContent}
          noteId={note?.id}
          onNoteSelect={onNoteSelect}
          tags={tags}
          onTagsChange={setTags}
          color={color}
          onColorChange={setColor}
          links={links}
        />
      </CardContent>
      <CardFooter>
        <NoteEditorActions
          onCancel={onCancel}
          onSave={handleManualSave}
          isSaving={isSaving}
          isNew={isNew}
          hasTitle={title.trim().length > 0}
        />
      </CardFooter>
    </Card>
  );
};

export default NoteEditor;
