
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabel } from "@/components/ui/form";
import { 
  Search, Filter, Clock, AlertCircle, ArrowUp, ArrowDown 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskFilter, TaskPriority } from "@/types/tasks";

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
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск задач..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter size={16} className="mr-2" />
              Фильтры
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => onToggleSort("dueDate")}
            >
              <Clock size={16} className="mr-2" />
              По сроку
              {sortBy === "dueDate" && (
                sortDirection === "asc" ? 
                  <ArrowUp size={14} className="ml-1" /> : 
                  <ArrowDown size={14} className="ml-1" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => onToggleSort("priority")}
            >
              <AlertCircle size={16} className="mr-2" />
              По приоритету
              {sortBy === "priority" && (
                sortDirection === "asc" ? 
                  <ArrowUp size={14} className="ml-1" /> : 
                  <ArrowDown size={14} className="ml-1" />
              )}
            </Button>
          </div>
          
          {isFiltersOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <FormLabel className="text-sm mb-2 block">Статус</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    if (value === "all") {
                      setFilter(prev => ({ ...prev, completed: undefined }));
                    } else {
                      setFilter(prev => ({ ...prev, completed: value === "completed" }));
                    }
                  }}
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Все задачи" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все задачи</SelectItem>
                    <SelectItem value="completed">Завершенные</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FormLabel className="text-sm mb-2 block">Приоритет</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    if (value === "all") {
                      setFilter(prev => {
                        const newFilter = {...prev};
                        delete newFilter.priority;
                        return newFilter;
                      });
                    } else {
                      setFilter(prev => ({ 
                        ...prev, 
                        priority: value as TaskPriority
                      }));
                    }
                  }}
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Любой приоритет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любой приоритет</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
