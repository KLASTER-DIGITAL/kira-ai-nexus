
import { useState, useCallback } from 'react';

export const useGraphFiltering = (initialTags: string[] = []) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showIsolatedNodes, setShowIsolatedNodes] = useState(true);
  
  // Переключение тега (добавление/удаление из выбранных)
  const toggleTag = useCallback((tag: string) => {
    // Пустая строка - значит сбросить все теги
    if (tag === "") {
      setSelectedTags([]);
      return;
    }
    
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  }, []);

  // Очистка всех фильтров
  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery('');
    setShowIsolatedNodes(true);
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

export default useGraphFiltering;
