
import React, { useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { MenuBar } from "./TipTapMenuBar";
import { WikiLink } from "./extensions/WikiLink";
import { WikiLinkSuggest } from "./extensions/WikiLinkSuggest";
import { useNoteLinks } from "@/hooks/notes/useNoteLinks";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  noteId?: string;
  onLinkClick?: (noteId: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  placeholder = "Начните писать...",
  autoFocus = false,
  editable = true,
  noteId,
  onLinkClick,
}) => {
  const { allNotes, createLink } = useNoteLinks(noteId);

  const handleWikiLinkClick = useCallback((href: string) => {
    // Find the note with this title
    const targetNote = allNotes.find((note) => 
      note.title.toLowerCase() === href.toLowerCase());
    
    if (targetNote && onLinkClick) {
      // If the link is valid and we have a noteId, create the link in database
      if (noteId && targetNote.id !== noteId) {
        createLink({
          sourceId: noteId,
          targetId: targetNote.id
        });
      }
      
      onLinkClick(targetNote.id);
    }
  }, [allNotes, onLinkClick, noteId, createLink]);

  const editor = useEditor({
    extensions: [
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
      WikiLink,
      WikiLinkSuggest.configure({
        suggestion: {
          items: ({ query }) => {
            if (!query) return [];
            
            const lowercaseQuery = query.toLowerCase();
            return allNotes
              .filter(note => note.title.toLowerCase().includes(lowercaseQuery))
              .slice(0, 10)
              .map((note, index) => ({
                index,
                id: note.id,
                title: note.title,
              }));
          }
        }
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      // Process and extract wiki links from content after each update
      if (noteId) {
        // Note: In a real application, you might want to debounce this
        const processWikiLinks = async () => {
          const wikiLinks = [];
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'text' && node.text) {
              const regex = /\[\[(.+?)\]\]/g;
              let match;
              while ((match = regex.exec(node.text)) !== null) {
                wikiLinks.push(match[1]);
              }
            }
            return true;
          });
          
          // For each wiki link, find the corresponding note and create a link
          for (const linkText of wikiLinks) {
            const targetNote = allNotes.find(
              (note) => note.title.toLowerCase() === linkText.toLowerCase()
            );
            
            if (targetNote && targetNote.id !== noteId) {
              createLink({
                sourceId: noteId,
                targetId: targetNote.id
              });
            }
          }
        };
        
        processWikiLinks();
      }
    },
    autofocus: autoFocus,
  });

  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    editorRef.current = editor;
    
    // Add click handler for wiki links
    if (editor && !editable) {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.matches('.wiki-link') || target.closest('.wiki-link')) {
          const wikiLink = target.closest('.wiki-link') as HTMLElement;
          if (wikiLink) {
            const href = wikiLink.getAttribute('href');
            if (href) {
              event.preventDefault();
              handleWikiLinkClick(href);
            }
          }
        }
      };
      
      const editorElement = editor.view.dom;
      editorElement.addEventListener('click', handleClick);
      
      return () => {
        editorElement.removeEventListener('click', handleClick);
      };
    }
  }, [editor, editable, handleWikiLinkClick]);

  return (
    <div className="tiptap-editor border rounded-md bg-background">
      {editor && editable && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4"
      />
    </div>
  );
};

export default TipTapEditor;
