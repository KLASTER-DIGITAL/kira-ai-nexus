
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TaskFilter } from "@/types/tasks";
import { Badge } from "@/components/ui/badge";

interface TaskFilterPopoverProps {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  clearAllFilters: () => void;
  activeFiltersCount: number;
}

const TaskFilterPopover: React.FC<TaskFilterPopoverProps> = ({
  isFiltersOpen,
  setIsFiltersOpen,
  filter,
  setFilter,
  clearAllFilters,
  activeFiltersCount,
}) => {
  // Handler for setting priority filter
  const handlePriorityChange = (value: string) => {
    if (value === "all") {
      const { priority, ...rest } = filter;
      setFilter(rest);
    } else {
      setFilter({ ...filter, priority: value as any });
    }
  };

  // Handler for setting completion status filter
  const handleCompletionChange = (value: string) => {
    if (value === "all") {
      const { completed, ...rest } = filter;
      setFilter(rest);
    } else {
      setFilter({ ...filter, completed: value === "completed" });
    }
  };

  return (
    <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 px-3">
          <Filter className="mr-1 h-3.5 w-3.5" />
          Фильтры
          {activeFiltersCount > 0 && (
            <Badge
              className="ml-2 bg-kira-purple text-white"
              variant="secondary"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Приоритет</div>
            <RadioGroup
              value={filter.priority || "all"}
              onValueChange={handlePriorityChange}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="priority-all" />
                <Label htmlFor="priority-all">Все</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="priority-low" />
                <Label htmlFor="priority-low">Низкий</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="priority-medium" />
                <Label htmlFor="priority-medium">Средний</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="priority-high" />
                <Label htmlFor="priority-high">Высокий</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Статус</div>
            <RadioGroup
              value={
                filter.completed === undefined
                  ? "all"
                  : filter.completed
                  ? "completed"
                  : "active"
              }
              onValueChange={handleCompletionChange}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label htmlFor="status-all">Все</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="status-active" />
                <Label htmlFor="status-active">Активные</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label htmlFor="status-completed">Завершенные</Label>
              </div>
            </RadioGroup>
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={clearAllFilters}
            >
              Сбросить все фильтры
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TaskFilterPopover;
