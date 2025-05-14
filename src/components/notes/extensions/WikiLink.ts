
import { Mark, markInputRule, markPasteRule } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    wikiLink: {
      setWikiLink: (attributes: { href: string; label?: string; isValid?: boolean }) => ReturnType;
      toggleWikiLink: (attributes: { href: string; label?: string; isValid?: boolean }) => ReturnType;
      unsetWikiLink: () => ReturnType;
    }
  }
}

export interface WikiLinkOptions {
  HTMLAttributes: Record<string, any>;
  validateLink?: (href: string) => Promise<boolean> | boolean;
}

export const WikiLink = Mark.create<WikiLinkOptions>({
  name: 'wikiLink',

  priority: 1000,

  inclusive: false,

  addOptions() {
    return {
      HTMLAttributes: {},
      validateLink: () => true,
    }
  },

  addAttributes() {
    return {
      href: {
        default: null,
      },
      label: {
        default: null,
      },
      isValid: {
        default: true,
        parseHTML: (element) => {
          return element.getAttribute('data-valid') !== 'false';
        },
        renderHTML: (attributes) => {
          if (attributes.isValid === false) {
            return { 'data-valid': 'false' };
          }
          return {};
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-wiki-link]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const isValid = HTMLAttributes.isValid !== false;
    
    return [
      'a',
      { 
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        'data-wiki-link': '', 
        'class': `wiki-link ${isValid ? 'wiki-link-valid' : 'wiki-link-invalid'}`,
        'data-valid': isValid ? 'true' : 'false',
        href: HTMLAttributes.href,
      },
      HTMLAttributes.label || HTMLAttributes.href
    ]
  },

  addCommands() {
    return {
      setWikiLink: attributes => ({ commands }) => {
        return commands.setMark(this.name, attributes)
      },

      toggleWikiLink: attributes => ({ commands }) => {
        return commands.toggleMark(this.name, attributes)
      },

      unsetWikiLink: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }) => {
            const decorations: Decoration[] = []
            const linkRegex = /\[\[(.+?)\]\]/g
            
            doc.descendants((node, pos) => {
              if (!node.isText) {
                return
              }

              const text = node.text || ''
              let match
              
              while ((match = linkRegex.exec(text)) !== null) {
                const start = pos + match.index
                const end = start + match[0].length
                const linkText = match[1]
                
                decorations.push(
                  Decoration.inline(start, end, {
                    class: 'wiki-link-wrapper',
                  })
                )
              }
            })
            
            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
