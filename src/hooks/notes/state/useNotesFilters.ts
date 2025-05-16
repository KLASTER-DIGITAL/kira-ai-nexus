
import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SortOption, GroupByOption } from "@/hooks/notes/types";

/**
 * Hook for managing note filters, sorting, and grouping
 */
export const useNotesFilters = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Load user preferences from localStorage
  const [sortOption, setSortOption] = useLocalStorage<SortOption>(
    "notes-sort-option", 
    "created_desc"
  );
  
  const [groupByOption, setGroupByOption] = useLocalStorage<GroupByOption>(
    "notes-group-by", 
    "none"
  );

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText("");
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

  return {
    searchText,
    setSearchText,
    selectedTags,
    setSelectedTags,
    currentPage,
    setCurrentPage,
    pageSize,
    sortOption,
    setSortOption,
    groupByOption,
    setGroupByOption,
    toggleTag,
    clearFilters,
    hasActiveFilters
  };
};
