
import { WikiLinkItem } from '@/hooks/notes/types';
import { wikiLinkPluginKey } from '../WikiLinkSuggest';

// Helper class to manage wiki link suggestions UI
export class WikiLinkSuggestionList {
  element: HTMLElement;
  items: WikiLinkItem[];
  command: (item: WikiLinkItem) => void;

  constructor({ items, command }: { items: WikiLinkItem[]; command: (item: WikiLinkItem) => void }) {
    this.items = items;
    this.command = command;
    this.element = document.createElement('div');
    this.element.className = 'tippy-box wiki-links-dropdown';
    this.element.innerHTML = this.renderItems();
    this.addEventListeners();
  }

  private renderItems(): string {
    return `
      <div class="tippy-content">
        <div class="items">
          ${this.items.length > 0 
            ? this.items.map(item => `
                <button class="item ${item.isNew ? 'new-item' : ''}" data-index="${item.index}">
                  ${item.isNew ? '+ Create' : ''} ${item.title}
                </button>
              `).join('') 
            : '<div class="no-results">No matching notes found</div>'}
        </div>
      </div>
    `;
  }

  private addEventListeners(): void {
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

  selectItem(index: number): void {
    const item = this.items[index];
    if (item) {
      this.command(item);
    }
  }

  updateItems(items: WikiLinkItem[]): void {
    this.items = items;
    // Update the DOM to reflect new items
    const itemsContainer = this.element.querySelector('.items');
    if (itemsContainer) {
      itemsContainer.innerHTML = this.items.length > 0 
        ? this.items.map(item => `
            <button class="item ${item.isNew ? 'new-item' : ''}" data-index="${item.index}">
              ${item.isNew ? '+ Create' : ''} ${item.title}
            </button>
          `).join('') 
        : '<div class="no-results">No matching notes found</div>';

      // Re-add click event listeners
      this.addEventListeners();
    }
  }
}
