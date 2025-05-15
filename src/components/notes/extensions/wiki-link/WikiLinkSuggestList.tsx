
import { useEffect, useState } from 'react';
import { WikiLinkItem } from './types';

interface WikiLinkSuggestListProps {
  items: WikiLinkItem[];
  command: (item: WikiLinkItem) => void;
}

class WikiLinkSuggestionList {
  element: HTMLElement;
  items: WikiLinkItem[];
  command: (item: WikiLinkItem) => void;

  constructor({ items, command }: WikiLinkSuggestListProps) {
    this.items = items;
    this.command = command;
    this.element = document.createElement('div');
    this.element.className = 'tippy-box wiki-links-dropdown';
    this.updateItems(items);
  }

  selectItem(index: number) {
    const item = this.items[index];
    if (item) {
      this.command(item);
    }
  }

  updateItems(items: WikiLinkItem[]) {
    this.items = items;
    // Update the DOM to reflect new items
    this.element.innerHTML = `
      <div class="tippy-content">
        <div class="items">
          ${items.length > 0 ? items.map(item => `
            <button class="item ${item.isNew ? 'new-item' : ''}" data-index="${item.index}">
              ${item.isNew ? '+ Create' : ''} ${item.title}
            </button>
          `).join('') : '<div class="no-results">No matching notes found</div>'}
        </div>
      </div>
    `;

    // Add click event listeners
    const buttons = this.element.querySelectorAll('button');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index || '0', 10);
        const item = this.items[index];
        if (item) {
          this.command(item);
        }
      });
    });
  }
}

export default WikiLinkSuggestionList;
