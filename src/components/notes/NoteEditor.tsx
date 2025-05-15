
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
  note?: Note;
  onUpdateNote: (note: Note) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
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
  const defaultNote: Note = {
    id: "",
    title: "",
    content: "",
    tags: [],
    user_id: "",
    type: "note"
  };

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState(note?.tags || []);
  
  const { links } = useNoteLinks(note?.id);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
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

  const handleSave = () => {
    onSave({
      title,
      content,
      tags
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <NoteMetadata
          title={title}
          onTitleChange={handleTitleChange}
          tags={tags}
          onTagsChange={handleTagsChange}
          color=""
          onColorChange={() => {}}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <NoteContent
          content={content}
          onContentChange={handleContentChange}
          tags={tags}
          onTagsChange={handleTagsChange}
          color=""
          onColorChange={() => {}}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <NoteEditorActions
          isNew={isNew}
          onSave={handleSave}
          onCancelClick={onCancel}
        />
      </CardFooter>
      {note?.id && <LocalGraphView nodeId={note.id} />}
    </Card>
  );
};

export default NoteEditor;
