
import { useCallback } from 'react';
import { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { WikiLink } from '@/components/notes/extensions/WikiLink';

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
      StarterKit,
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
    ];
  }, [placeholder, validateWikiLink]);

  return { getExtensions };
};
