
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { TaskFilter } from "@/types/tasks";

interface TaskFilterBadgesProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  clearAllFilters: () => void;
  activeFiltersCount: number;
}

const TaskFilterBadges: React.FC<TaskFilterBadgesProps> = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  clearAllFilters,
  activeFiltersCount
}) => {
  if (!activeFiltersCount && !searchQuery) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Поиск: {searchQuery}
          <X 
            size={14} 
            className="cursor-pointer ml-1" 
            onClick={() => setSearchQuery("")}
          />
        </Badge>
      )}
      
      {filter.completed !== undefined && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {filter.completed ? "Завершенные" : "Активные"}
          <X 
            size={14} 
            className="cursor-pointer ml-1" 
            onClick={() => {
              const newFilter = {...filter};
              delete newFilter.completed;
              setFilter(newFilter);
            }}
          />
        </Badge>
      )}
      
      {filter.priority && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Приоритет: {filter.priority === "high" ? "Высокий" : filter.priority === "medium" ? "Средний" : "Низкий"}
          <X 
            size={14} 
            className="cursor-pointer ml-1" 
            onClick={() => {
              const newFilter = {...filter};
              delete newFilter.priority;
              setFilter(newFilter);
            }}
          />
        </Badge>
      )}
      
      {(activeFiltersCount > 0 || searchQuery) && (
        <Badge 
          variant="outline" 
          className="cursor-pointer text-muted-foreground"
          onClick={clearAllFilters}
        >
          Сбросить все
        </Badge>
      )}
    </div>
  );
};

export default TaskFilterBadges;
