
import { Mark, markInputRule, markPasteRule } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    wikiLink: {
      setWikiLink: (attributes: { href: string; label?: string }) => ReturnType;
      toggleWikiLink: (attributes: { href: string; label?: string }) => ReturnType;
      unsetWikiLink: () => ReturnType;
    }
  }
}

export interface WikiLinkOptions {
  HTMLAttributes: Record<string, any>;
}

export const WikiLink = Mark.create<WikiLinkOptions>({
  name: 'wikiLink',

  priority: 1000,

  inclusive: false,

  addOptions() {
    return {
      HTMLAttributes: {},
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
    return [
      'a',
      { 
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        'data-wiki-link': '', 
        class: 'wiki-link',
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
