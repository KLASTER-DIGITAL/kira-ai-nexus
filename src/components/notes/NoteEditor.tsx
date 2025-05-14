
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { X, Save, Tags } from "lucide-react";
import TipTapEditor from "./TipTapEditor";
import { Badge } from "@/components/ui/badge";

interface NoteEditorProps {
  note?: Note;
  onSave: (note: { title: string; content: string; tags: string[] }) => void;
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
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) {
      return; // Prevent saving without a title
    }
    onSave({
      title,
      content,
      tags
    });
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
        <TipTapEditor 
          content={content} 
          onChange={setContent} 
          placeholder="Содержание заметки..."
          autoFocus={false}
        />
        
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Tags className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Теги:</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
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
