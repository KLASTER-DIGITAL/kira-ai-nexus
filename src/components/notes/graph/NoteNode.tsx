
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Note, NoteContent } from '@/types/notes';

interface NoteNodeData {
  note: Note;
}

// Функция для получения текстового содержимого заметки
const getNoteContent = (note: Note): string => {
  if (typeof note.content === 'string') {
    return note.content;
  } else if (note.content && typeof note.content === 'object') {
    return note.content.text || '';
  }
  return '';
};

// Функция для получения тегов заметки
const getNoteTags = (note: Note): string[] => {
  if (typeof note.content === 'object' && note.content?.tags) {
    return note.content.tags;
  }
  return note.tags || [];
};

const NoteNode = ({ data }: { data: NoteNodeData }) => {
  const { note } = data;
  const content = getNoteContent(note);
  const tags = getNoteTags(note);

  // Создаем краткое описание для отображения в узле графа
  const previewText = content
    .replace(/<[^>]*>/g, '') // Удаляем HTML-теги
    .slice(0, 50) + (content.length > 50 ? '...' : '');

  return (
    <div className="w-40 p-2 bg-card border rounded shadow-sm">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <div>
        <h4 className="text-sm font-medium truncate">{note.title}</h4>
        {previewText && (
          <p className="text-xs text-muted-foreground truncate">{previewText}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-1 text-[10px] bg-muted rounded">
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
};

export default memo(NoteNode);
