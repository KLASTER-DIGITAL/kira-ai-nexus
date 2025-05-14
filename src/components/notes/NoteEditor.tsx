
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
import { X, Save } from "lucide-react";

interface NoteEditorProps {
  note?: Note;
  onSave: (note: { title: string; content: string }) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel,
  isNew = false
}) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) {
      return; // Prevent saving without a title
    }
    onSave({
      title,
      content
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок заметки"
          className="font-medium text-lg"
          autoFocus
        />
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Содержание заметки..."
          className="min-h-[200px] resize-none"
          rows={10}
        />
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
          onClick={handleSave}
          size="sm"
          disabled={!title.trim()}
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
