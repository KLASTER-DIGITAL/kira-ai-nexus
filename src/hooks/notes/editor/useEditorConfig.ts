
import { useMemo, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { WikiLink } from "@/components/notes/extensions/wiki-link/WikiLink";
import { useWikiLinks } from "../links/useWikiLinks";
import { TagSuggestion } from "@/components/notes/extensions/tags/TagSuggestion";
import { useTags } from "../useTags";

interface EditorConfigProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  noteId?: string;
  onNoteCreated?: (noteId: string) => void;
}

export const useEditorConfig = ({ 
  content, 
  onChange, 
  placeholder, 
  editable = true, 
  autoFocus = false, 
  noteId, 
  onNoteCreated 
}: EditorConfigProps) => {
  const supabase = useSupabaseClient();
  const { tags } = useTags();
  
  // Define extensions used in the editor
  const extensions = useMemo(() => [
    StarterKit.configure({
      history: true
    }),
    Placeholder.configure({
      placeholder: placeholder || 'Начните писать...'
    }),
    Link.configure({
      openOnClick: false
    }),
    WikiLink.configure({
      noteId: noteId || '',
      onNoteCreated: onNoteCreated
    }),
    TagSuggestion.configure({
      suggestion: {
        items: ({ query }) => {
          // Filter tags based on query
          if (!query) return tags;
          return tags.filter(tag => 
            tag.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          return {
            onStart: () => {},
            onUpdate: () => {},
            onKeyDown: () => {},
            onExit: () => {}
          };
        }
      }
    })
  ], [placeholder, tags, noteId, onNoteCreated]);

  // Get the wiki link functionality
  const { handleWikiLinkClick, isCreatingLink } = useWikiLinks(noteId, onNoteCreated);

  // Handle link click
  const handleLinkClick = useCallback((href: string) => {
    if (href.startsWith("[[")) {
      handleWikiLinkClick(href);
    } else {
      window.open(href, '_blank');
    }
  }, [handleWikiLinkClick]);

  // Only validate links when we have a note ID
  const validateLinks = useCallback((editor: any) => {
    if (!noteId) return;
    // This functionality is currently handled separately by the wiki link extension
    // or can be implemented here if needed
  }, [noteId]);

  // Prepare editor configuration with all extensions
  const getEditorConfig = useCallback(() => {
    return {
      editable,
      content,
      onUpdate: ({ editor }: { editor: any }) => {
        onChange(editor.getHTML());
      },
      autofocus: autoFocus,
      extensions,
      editorProps: {
        attributes: {
          class: 'focus:outline-none'
        },
        handleClick: (view: any, pos: number, event: any) => {
          const { schema } = view.state;
          const node = schema.nodes.link;
          if (!(event.target instanceof HTMLAnchorElement)) {
            return false;
          }
          const element = event.target;
          const href = element.getAttribute('href');
          if (href) {
            handleLinkClick(href);
            return true;
          }
          return false;
        }
      }
    };
  }, [content, extensions, editable, autoFocus, onChange, handleLinkClick]);

  return {
    getEditorConfig,
    validateLinks
  };
};
