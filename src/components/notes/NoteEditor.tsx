import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { useNoteLinks } from "@/hooks/notes/useNoteLinks";
import { useNoteAutosave } from "@/hooks/notes/useNoteAutosave";
import NoteMetadata from "./editor/NoteMetadata";
import NoteContent from "./editor/NoteContent";
import NoteEditorActions from "./editor/NoteEditorActions";
import { LocalGraphView } from "@/components/graph";

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  isNew?: boolean;
  onCancel?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdateNote, onDeleteNote, isNew = false, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || "");
  const [tags, setTags] = useState(note.tags || []);
  const [isFavorite, setIsFavorite] = useState(note.is_favorite || false);
  const [updatedNote, setUpdatedNote] = useState<Note>(note);
  const { generateLinks } = useNoteLinks();

  // Autosave functionality
  useNoteAutosave({
    note: updatedNote,
    onUpdateNote: onUpdateNote,
    enabled: !isNew,
  });

  useEffect(() => {
    // Update the local state when the note prop changes
    setTitle(note.title);
    setContent(note.content || "");
    setTags(note.tags || []);
    setIsFavorite(note.is_favorite || false);
    setUpdatedNote(note);
  }, [note]);

  useEffect(() => {
    // Update the updatedNote state when the local state changes
    setUpdatedNote({
      ...updatedNote,
      title: title,
      content: content,
      tags: tags,
      is_favorite: isFavorite,
    });
  }, [title, content, tags, isFavorite]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    generateLinks(value, note.id);
  };

  const handleTagsChange = (tags: string[]) => {
    setTags(tags);
  };

  const handleFavoriteChange = (checked: boolean) => {
    setIsFavorite(checked);
  };

  const handleSave = async () => {
    await onUpdateNote(updatedNote);
  };

  const handleDelete = async () => {
    await onDeleteNote(note.id);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <NoteMetadata
          title={title}
          tags={tags}
          isFavorite={isFavorite}
          onTitleChange={handleTitleChange}
          onTagsChange={handleTagsChange}
          onFavoriteChange={handleFavoriteChange}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <NoteContent content={content} onContentChange={handleContentChange} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <NoteEditorActions
          isNew={isNew}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      </CardFooter>
      <LocalGraphView nodeId={note.id} />
    </Card>
  );
};

export default NoteEditor;
