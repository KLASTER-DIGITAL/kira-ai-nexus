
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { WikiLinkItem } from './WikiLinkSuggestion';

interface WikiLinkSuggestListProps {
  items: WikiLinkItem[];
  command: (item: WikiLinkItem) => void;
}

export default forwardRef((props: WikiLinkSuggestListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const onKeyUp = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const onKeyDown = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const onEnter = () => {
    selectItem(selectedIndex);
  };

  useImperativeHandle(ref, () => ({
    onKeyUp,
    onKeyDown,
    onEnter,
  }));

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  if (props.items.length === 0) {
    return (
      <div className="wiki-suggestion">
        <div className="wiki-suggestion-item">
          <div className="wiki-suggestion-no-results">
            Нет результатов. Нажмите Enter, чтобы создать новую заметку.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wiki-suggestion">
      {props.items.map((item, index) => (
        <div
          key={item.id}
          className={`wiki-suggestion-item ${index === selectedIndex ? 'is-selected' : ''}`}
          onClick={() => selectItem(index)}
        >
          <div className="wiki-suggestion-title">{item.title}</div>
        </div>
      ))}
    </div>
  );
});
