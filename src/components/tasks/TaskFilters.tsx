
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, SortAsc, SortDesc, CalendarIcon, Flag } from "lucide-react";
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            className="pl-9 pr-9" 
            placeholder="Поиск задач..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Filter button */}
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
        
        {/* Sort buttons */}
        <TooltipProvider>
          {/* Due date sort */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={sortBy === "dueDate" ? "secondary" : "outline"} 
                size="icon"
                onClick={() => onToggleSort("dueDate")}
              >
                <CalendarIcon size={16} />
                {sortBy === "dueDate" && (
                  <div className="absolute -top-1 -right-1 h-3 w-3">
                    {sortDirection === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />}
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Сортировать по дате</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Priority sort */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={sortBy === "priority" ? "secondary" : "outline"} 
                size="icon"
                onClick={() => onToggleSort("priority")}
                className="ml-1"
              >
                <Flag size={16} />
                {sortBy === "priority" && (
                  <div className="absolute -top-1 -right-1 h-3 w-3">
                    {sortDirection === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />}
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Сортировать по приоритету</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Active filters badges */}
      {(activeFiltersCount > 0 || searchQuery) && (
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
      )}
    </div>
  );
};

export default TaskFilters;
