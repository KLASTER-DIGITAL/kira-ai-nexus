
import { Mark, markPasteRule, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

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
    }
  }
}

export interface WikiLinkOptions {
  HTMLAttributes: Record<string, any>;
}

export const WikiLink = Mark.create<WikiLinkOptions>({
  name: 'wikiLink',

  priority: 1000,
  
  keepOnSplit: false,

  inclusive: false,
  
  exitable: true,

  defaultOptions: {
    HTMLAttributes: {
      class: 'wiki-link',
    },
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
        tag: 'a[data-type="wikiLink"]',
        getAttrs: (element) => {
          if (typeof element === 'string') {
            return {};
          }
          const htmlElement = element as HTMLElement;
          return {
            href: htmlElement.getAttribute('href'),
            label: htmlElement.getAttribute('data-label'),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'wikiLink',
        href: HTMLAttributes.href,
        'data-label': HTMLAttributes.label,
      }, HTMLAttributes),
      HTMLAttributes.label || '[[' + HTMLAttributes.href + ']]',
    ];
  },

  addCommands() {
    return {
      setWikiLink:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      toggleWikiLink:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetWikiLink:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: /\[\[(.+?)\]\]/g,
        type: this.type,
        getAttributes: (match) => {
          const [, linkText] = match;
          return { href: linkText, label: linkText };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    const wikiLinkRegex = /\[\[(.+?)\]\]/g;
    
    return [
      new Plugin({
        key: new PluginKey('wikiLinkDetector'),
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations: any[] = [];
            
            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || '';
                let match;
                
                while ((match = wikiLinkRegex.exec(text)) !== null) {
                  const start = pos + match.index;
                  const end = start + match[0].length;
                  const decoration = Decoration.inline(start, end, {
                    class: 'wiki-link-highlight',
                  });
                  
                  decorations.push(decoration);
                }
              }
            });
            
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
