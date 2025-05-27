
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance } from 'tippy.js';
import { SlashCommandsList } from './SlashCommandsList';
import { createSlashCommands } from './commandsConfig';

export const createSlashCommandsSuggestion = () => ({
  items: ({ query, editor }: { query: string; editor: any }) => {
    const commands = createSlashCommands(editor);
    return commands
      .filter(item => {
        const searchText = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchText) ||
          item.description.toLowerCase().includes(searchText) ||
          (item.aliases && item.aliases.some(alias => alias.toLowerCase().includes(searchText)))
        );
      })
      .slice(0, 10);
  },

  render: () => {
    let component: ReactRenderer;
    let popup: Instance[];

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(SlashCommandsList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
});
