
import { Mark, markPasteRule } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { DecorationSet, Decoration } from '@tiptap/pm/view';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    wikiLink: {
      /**
       * Set a wiki link
       */
      setWikiLink: (attributes: { href: string; label: string }) => ReturnType;
      /**
       * Toggle a wiki link
       */
      toggleWikiLink: (attributes: { href: string; label: string }) => ReturnType;
      /**
       * Unset a wiki link
       */
      unsetWikiLink: () => ReturnType;
    };
  }
}

export interface WikiLinkOptions {
  HTMLAttributes: Record<string, any>;
  /**
   * A function that returns the proper URL for a link
   */
  renderHref?: (attrs: { href: string }) => string;
}

export const WikiLink = Mark.create<WikiLinkOptions>({
  name: 'wikiLink',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderHref: attrs => attrs.href,
    };
  },

  addAttributes() {
    return {
      href: {
        default: null,
      },
      label: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[class=wiki-link]',
        getAttrs: element => {
          if (typeof element === 'string') {
            return {};
          }
          const href = element.getAttribute('href');
          const label = element.textContent;
          return { href, label };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, options }) {
    const href = options.renderHref
      ? options.renderHref(HTMLAttributes)
      : HTMLAttributes.href;

    return [
      'a',
      {
        ...options.HTMLAttributes,
        class: 'wiki-link',
        href,
        'data-label': HTMLAttributes.label,
      },
      HTMLAttributes.label || HTMLAttributes.href,
    ];
  },

  addCommands() {
    return {
      setWikiLink:
        attributes => ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      toggleWikiLink:
        attributes => ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetWikiLink:
        () => ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: /\[\[(.*?)\]\]/g,
        type: this.type,
        getAttributes: match => {
          const [, label] = match;
          return { href: label, label };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    // Highlight wiki links in the editor
    return [
      new Plugin({
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations: any[] = [];
            
            doc.descendants((node, pos) => {
              if (node.type.name === 'text' && node.text) {
                const regex = /\[\[(.+?)\]\]/g;
                let match;
                
                while ((match = regex.exec(node.text)) !== null) {
                  const start = pos + match.index;
                  const end = start + match[0].length;
                  
                  decorations.push(
                    Decoration.inline(start, end, {
                      class: 'wiki-link-highlight'
                    })
                  );
                }
              }
              
              return true;
            });
            
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
