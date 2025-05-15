
import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskFilter } from "@/types/tasks";
import { getPriorityLabel } from "../TaskPriorityUtils";

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
  // Only render if there are filters or search
  if (activeFiltersCount === 0 && !searchQuery) {
    return null;
  }

  // Remove a specific filter
  const removeFilter = (key: keyof TaskFilter) => {
    const { [key]: _, ...rest } = filter;
    setFilter(rest);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {searchQuery && (
        <Badge variant="outline" className="pl-2 pr-1 py-1 h-6">
          Поиск: {searchQuery}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1 hover:bg-muted rounded-full"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      )}

      {filter.priority && (
        <Badge variant="outline" className="pl-2 pr-1 py-1 h-6">
          Приоритет: {getPriorityLabel(filter.priority)}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1 hover:bg-muted rounded-full"
            onClick={() => removeFilter("priority")}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      )}

      {filter.completed !== undefined && (
        <Badge variant="outline" className="pl-2 pr-1 py-1 h-6">
          Статус: {filter.completed ? "Завершенные" : "Активные"}
          <Button
            variant="ghost"
            size="icon" 
            className="h-4 w-4 ml-1 hover:bg-muted rounded-full"
            onClick={() => removeFilter("completed")}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      )}

      {(activeFiltersCount > 0 || searchQuery) && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={clearAllFilters}
        >
          Очистить все
        </Button>
      )}
    </div>
  );
};

export default TaskFilterBadges;
