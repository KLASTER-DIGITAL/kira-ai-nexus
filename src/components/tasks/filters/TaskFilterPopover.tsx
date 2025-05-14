
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { TaskFilter, TaskPriority } from "@/types/tasks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  // Handle priority selection
  const handlePriorityChange = (priority: TaskPriority | "") => {
    if (priority === "") {
      const newFilter = {...filter};
      delete newFilter.priority;
      setFilter(newFilter);
    } else {
      setFilter({...filter, priority: priority as TaskPriority});
    }
  };
  
  // Handle completion status selection
  const handleCompletionChange = (status: string) => {
    if (status === "all") {
      const newFilter = {...filter};
      delete newFilter.completed;
      setFilter(newFilter);
    } else {
      setFilter({...filter, completed: status === "completed"});
    }
  };

  return (
    <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter size={16} className="mr-1" /> 
          Фильтры
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Фильтры</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-1 text-muted-foreground"
              onClick={clearAllFilters}
            >
              Сбросить все
            </Button>
          </div>
          <Separator />
          
          {/* Status filter */}
          <div className="space-y-2">
            <Label>Статус</Label>
            <RadioGroup 
              value={filter.completed === undefined ? "all" : (filter.completed ? "completed" : "active")}
              onValueChange={handleCompletionChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">Все</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="cursor-pointer">Активные</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed" className="cursor-pointer">Завершенные</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Priority filter */}
          <div className="space-y-2">
            <Label>Приоритет</Label>
            <Select 
              value={filter.priority || ""} 
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Любой приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Любой приоритет</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="low">Низкий</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TaskFilterPopover;
