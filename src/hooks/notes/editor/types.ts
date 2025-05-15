
import { Editor, Extensions } from '@tiptap/react';

export interface EditorConfigProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  noteId?: string;
  onNoteCreated?: (noteId: string) => void;
}

export interface EditorExtension {
  name: string;
  options?: Record<string, any>;
}

export interface WikiLinkOptions {
  noteId: string;
  onNoteCreated?: (noteId: string) => void;
}

export interface TagSuggestionOptions {
  suggestion: {
    items: string[];
    render: () => any;
  };
}
