
/**
 * Types for wiki link suggestions
 */

export interface WikiLinkItem {
  id: string;
  title: string;
  index: number;
  type?: string;
  isNew?: boolean;
}

export type FetchWikiLinkSuggestions = (query: string) => Promise<WikiLinkItem[]>;
export type CreateWikiLink = (title: string) => Promise<{ id: string; title: string; type: string }>;

