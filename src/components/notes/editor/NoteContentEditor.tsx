
import React from 'react';
import { Card } from '@/components/ui/card';
import { LinkData } from '@/hooks/notes/links/types';

interface NoteContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  noteId?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  color: string;
  onColorChange: (color: string) => void;
  links?: LinkData[];
  onNoteSelect?: (noteId: string) => void;
}

const NoteContentEditor: React.FC<NoteContentEditorProps> = ({
  content,
  onContentChange,
  noteId,
  tags,
  onTagsChange,
  color,
  onColorChange,
  links,
  onNoteSelect
}) => {
  return (
    <Card className="w-full h-full bg-background p-4 min-h-[300px] border-0">
      <textarea
        className="w-full h-full min-h-[280px] bg-transparent border-0 outline-none resize-none"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Введите текст заметки..."
      />
    </Card>
  );
};

export default NoteContentEditor;
