
import { useState, useMemo } from 'react';
import { Task, TaskFilter } from '@/types/tasks';

export const useTaskFiltering = (tasks: Task[] | undefined) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const handleToggleSort = (sortField: "dueDate" | "priority") => {
    if (sortBy === sortField) {
      // Toggle direction if already sorting by this field
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // Set new field and reset to ascending
      setSortBy(sortField);
      setSortDirection("asc");
    }
  };
  
  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks) return [];
    
    let filteredTasks = tasks;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    if (sortBy) {
      filteredTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === "dueDate") {
          // Handle tasks without due dates
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return sortDirection === "asc" ? 1 : -1;
          if (!b.dueDate) return sortDirection === "asc" ? -1 : 1;
          
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          return sortDirection === "asc" 
            ? dateA.getTime() - dateB.getTime() 
            : dateB.getTime() - dateA.getTime();
        }
        
        if (sortBy === "priority") {
          const priorityValues = {
            "high": 3,
            "medium": 2,
            "low": 1
          };
          
          const valueA = priorityValues[a.priority] || 0;
          const valueB = priorityValues[b.priority] || 0;
          
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }
        
        return 0;
      });
    }
    
    return filteredTasks;
  }, [tasks, searchQuery, sortBy, sortDirection]);

  const isSearching = searchQuery.trim().length > 0;
  
  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDirection,
    handleToggleSort,
    filteredAndSortedTasks,
    isSearching
  };
};
