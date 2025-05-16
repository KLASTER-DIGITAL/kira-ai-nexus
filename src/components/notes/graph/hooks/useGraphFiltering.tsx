
import { useState, useCallback } from 'react';

export const useGraphFiltering = (initialTags: string[] = []) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showIsolatedNodes, setShowIsolatedNodes] = useState(true);
  
  // Tag filtering
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery('');
  }, []);

  return {
    selectedTags,
    searchQuery,
    showIsolatedNodes,
    setSelectedTags,
    setSearchQuery,
    setShowIsolatedNodes,
    toggleTag,
    clearFilters,
    hasFilters: selectedTags.length > 0 || searchQuery.trim().length > 0,
  };
};
