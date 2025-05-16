import React from 'react';
import { LinkData } from '@/hooks/notes/links/types';

interface NoteContentEditorProps {
  content: string;
  onContentChange: (value: string) => void;
  noteId?: string;
  onNoteSelect?: (noteId: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  color: string;
  onColorChange: (color: string) => void;
  links?: LinkData;
}

const NoteContentEditor: React.FC<NoteContentEditorProps> = ({
  content,
  onContentChange,
  noteId,
  onNoteSelect,
  tags,
  onTagsChange,
  color,
  onColorChange,
  links,
}) => {
  // Simple editor for now, can be enhanced with TipTap or other rich editors
  return (
    <div className="flex flex-col h-full">
      <textarea
        className="w-full h-full resize-none border rounded p-2"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Введите текст заметки..."
      />
      
      {/* Tags will go here */}
      <div className="mt-2">
        {/* Tag editing UI */}
      </div>
    </div>
  );
};

export default NoteContentEditor;
