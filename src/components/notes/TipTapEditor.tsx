
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
import { useNotesMutations } from "@/hooks/notes/useNotesMutations";
import { toast } from "@/hooks/use-toast";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  noteId?: string;
  onLinkClick?: (noteId: string) => void;
  onNoteCreated?: (noteId: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  placeholder = "Начните писать...",
  autoFocus = false,
  editable = true,
  noteId,
  onLinkClick,
  onNoteCreated,
}) => {
  const { allNotes, createLink, updateLinks } = useNoteLinks(noteId);
  const { createNote } = useNotesMutations();

  // Create a new note from a wiki link
  const handleCreateNote = useCallback(async (title: string) => {
    try {
      // Create a new note with the link text as the title
      const newNote = await createNote({
        title,
        content: '',
        tags: []
      });
      
      // If we have a source note ID, create a link between them
      if (noteId) {
        createLink({
          sourceId: noteId,
          targetId: newNote.id
        });
      }
      
      // Notify parent component
      if (onNoteCreated) {
        onNoteCreated(newNote.id);
      }
      
      toast({
        title: "Заметка создана",
        description: `Создана новая заметка "${title}"`,
      });
      
      return {
        id: newNote.id,
        title: newNote.title,
        type: 'note'
      };
    } catch (error) {
      console.error("Error creating note from link:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заметку",
        variant: "destructive"
      });
      throw error;
    }
  }, [noteId, createNote, createLink, onNoteCreated]);

  // Validate links against existing notes
  const validateWikiLink = useCallback((href: string) => {
    return allNotes.some(note => note.id === href);
  }, [allNotes]);

  const handleWikiLinkClick = useCallback((href: string) => {
    // Find the note with this ID
    const targetNote = allNotes.find((note) => 
      note.id === href || note.title.toLowerCase() === href.toLowerCase());
    
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
      WikiLink.configure({
        validateLink: validateWikiLink
      }),
      WikiLinkSuggest({
        fetchNotes: async (query) => {
          if (!query) return [];
          
          const lowercaseQuery = query.toLowerCase();
          return allNotes
            .filter(note => note.title.toLowerCase().includes(lowercaseQuery))
            .slice(0, 10)
            .map((note, index) => ({
              index,
              id: note.id,
              title: note.title,
              type: 'note'
            }));
        },
        editor,
        onCreateNote: handleCreateNote
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      // Process and extract wiki links from content after each update
      if (noteId) {
        // Extract wiki links from content
        const processWikiLinks = async () => {
          const wikiLinks = [];
          editor.state.doc.descendants((node, pos) => {
            const marks = node.marks.filter(mark => mark.type.name === 'wikiLink');
            
            if (marks.length > 0) {
              for (const mark of marks) {
                wikiLinks.push({
                  href: mark.attrs.href,
                  label: mark.attrs.label || mark.attrs.href,
                  isValid: mark.attrs.isValid !== false
                });
              }
            }
            
            // Also check for [[text]] format
            if (node.type.name === 'text' && node.text) {
              const regex = /\[\[(.+?)\]\]/g;
              let match;
              while ((match = regex.exec(node.text)) !== null) {
                wikiLinks.push({
                  href: match[1],
                  label: match[1],
                  isValid: true // We don't know yet
                });
              }
            }
            
            return true;
          });
          
          // For each wiki link, find the corresponding note and create a link
          for (const link of wikiLinks) {
            const targetNote = allNotes.find(
              (note) => note.id === link.href || note.title.toLowerCase() === link.href.toLowerCase()
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

  // Update wiki links when notes are renamed
  useEffect(() => {
    if (!editor || !noteId) return;
    
    const validateLinks = () => {
      editor.view.state.doc.descendants((node, pos) => {
        const wikiLinkMarks = node.marks.filter(mark => mark.type.name === 'wikiLink');
        
        if (wikiLinkMarks.length > 0) {
          wikiLinkMarks.forEach(mark => {
            const href = mark.attrs.href;
            const isValid = allNotes.some(note => note.id === href);
            
            // If validity has changed, update the mark
            if (isValid !== mark.attrs.isValid) {
              const from = pos;
              const to = pos + node.nodeSize;
              
              editor.view.dispatch(
                editor.view.state.tr.removeMark(from, to, mark.type).addMark(
                  from,
                  to,
                  mark.type.create({
                    ...mark.attrs,
                    isValid
                  })
                )
              );
            }
          });
        }
        
        return true;
      });
    };
    
    validateLinks();
  }, [editor, allNotes, noteId]);

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
