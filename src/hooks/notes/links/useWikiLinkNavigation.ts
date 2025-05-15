
import { useCallback } from 'react';

/**
 * Hook for handling navigation through wiki links
 */
export const useWikiLinkNavigation = () => {
  /**
   * Handle click on a wiki link in read-only mode
   */
  const handleWikiLinkClick = useCallback((href: string, onLinkClick: (noteId: string) => void) => {
    if (href) {
      onLinkClick(href);
    }
  }, []);

  return { handleWikiLinkClick };
};
