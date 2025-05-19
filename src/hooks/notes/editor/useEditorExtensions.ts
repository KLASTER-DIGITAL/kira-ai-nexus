
import { useCallback } from 'react';
import { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { WikiLink } from '@/components/notes/extensions/WikiLink';
import TaskList from '@/components/notes/extensions/task-list/TaskList';
import TaskItem from '@/components/notes/extensions/task-item/TaskItem';

/**
 * Hook for configuring TipTap editor extensions
 */
export const useEditorExtensions = (
  placeholder: string,
  validateWikiLink: (href: string) => boolean
) => {
  /**
   * Create the editor extensions array
   */
  const getExtensions = useCallback((): Extensions => {
    // Define extensions array
    return [
      StarterKit.configure({
        // Disable the built-in list types that conflict with our custom task lists
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      Underline,
      Image,
      WikiLink.configure({
        validateLink: validateWikiLink
      }),
      // Расширенные возможности форматирования
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      // Text style extensions for color support
      TextStyle,
      Color,
      // Task management extensions
      TaskList,
      TaskItem,
    ];
  }, [placeholder, validateWikiLink]);

  return { getExtensions };
};
