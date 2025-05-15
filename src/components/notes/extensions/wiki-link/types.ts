
import { PluginKey } from '@tiptap/pm/state';

// Create a suggestion plugin key
export const wikiLinkPluginKey = new PluginKey('wiki-link-suggestion');

export interface WikiLinkItem {
  id: string;
  title: string;
  index: number;
  type?: string;
  isNew?: boolean;
}

export interface WikiLinkSuggestionListProps {
  items: WikiLinkItem[];
  command: (item: WikiLinkItem) => void;
}
