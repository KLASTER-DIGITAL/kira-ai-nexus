
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { SlashCommandItem } from './SlashCommands';

interface SlashCommandsListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

interface SlashCommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const SlashCommandsList = forwardRef<SlashCommandsListRef, SlashCommandsListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="slash-commands-list bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 max-h-80 overflow-y-auto z-50">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={`w-full text-left p-3 rounded-md flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            onClick={() => selectItem(index)}
          >
            <span className="text-lg">{item.icon}</span>
            <div>
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="p-3 text-gray-500 text-sm">Команды не найдены</div>
      )}
    </div>
  );
});

SlashCommandsList.displayName = 'SlashCommandsList';
