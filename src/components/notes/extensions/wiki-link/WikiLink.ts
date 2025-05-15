
import { Mark, markPasteRule } from '@tiptap/core';

export interface WikiLinkOptions {
  HTMLAttributes: Record<string, any>;
  noteId: string;
  onNoteCreated?: (noteId: string) => void;
}

export const WikiLink = Mark.create<WikiLinkOptions>({
  name: 'wikiLink',
  
  addOptions() {
    return {
      HTMLAttributes: {},
      noteId: '',
      onNoteCreated: undefined,
    };
  },
  
  addAttributes() {
    return {
      href: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },
  
  parseHTML() {
    return [
      { 
        tag: 'a[data-type="wiki-link"]',
        getAttrs: node => {
          if (typeof node === 'string') return {};
          
          const element = node as HTMLElement;
          return { 
            href: element.getAttribute('href'), 
            title: element.getAttribute('title')
          };
        }
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['a', { ...HTMLAttributes, 'data-type': 'wiki-link', class: 'wiki-link' }, 0];
  },
  
  addCommands() {
    return {
      setWikiLink: attributes => ({ chain }) => {
        return chain()
          .setMark(this.name, attributes)
          .run();
      },
      toggleWikiLink: attributes => ({ chain }) => {
        return chain()
          .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
          .run();
      },
      unsetWikiLink: () => ({ chain }) => {
        return chain()
          .unsetMark(this.name, { extendEmptyMarkRange: true })
          .run();
      },
    };
  },
  
  addKeyboardShortcuts() {
    return {
      'Mod-k': () => this.editor.commands.toggleWikiLink(),
    };
  },
});
