
import React from "react";
import { TaskFilter } from "@/types/tasks";
import TaskFilterSearch from "./filters/TaskFilterSearch";
import TaskSortButtons from "./filters/TaskSortButtons";
import TaskFilterPopover from "./filters/TaskFilterPopover";
import TaskFilterBadges from "./filters/TaskFilterBadges";

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  sortBy: "dueDate" | "priority" | "";
  sortDirection: "asc" | "desc";
  onToggleSort: (field: "dueDate" | "priority") => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  isFiltersOpen,
  setIsFiltersOpen,
  filter,
  setFilter,
  sortBy,
  sortDirection,
  onToggleSort
}) => {
  // Handler for clearing all filters
  const clearAllFilters = () => {
    setFilter({});
    setSearchQuery("");
  };
  
  // Count active filters
  const activeFiltersCount = Object.keys(filter).length;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search input */}
        <TaskFilterSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        {/* Filter button */}
        <TaskFilterPopover
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          filter={filter}
          setFilter={setFilter}
          clearAllFilters={clearAllFilters}
          activeFiltersCount={activeFiltersCount}
        />
        
        {/* Sort buttons */}
        <TaskSortButtons
          sortBy={sortBy}
          sortDirection={sortDirection}
          onToggleSort={onToggleSort}
        />
      </div>
      
      {/* Active filters badges */}
      <TaskFilterBadges
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
        clearAllFilters={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
      />
    </div>
  );
};

export default TaskFilters;
