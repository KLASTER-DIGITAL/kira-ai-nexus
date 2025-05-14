
import React, { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskFilter } from "@/types/tasks";
import { useAuth } from "@/context/auth";
import TaskListHeader from "./TaskListHeader";
import TaskFilters from "./TaskFilters";
import TaskItem from "./TaskItem";
import TaskCreateDialog from "./TaskCreateDialog";
import { Card, CardContent } from "@/components/ui/card";

const TaskList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<TaskFilter>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  
  const { tasks, isLoading, toggleTaskCompletion, createTask, updateTask, deleteTask } = useTasks(filter);
  
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
  
  const getFilteredAndSortedTasks = () => {
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
  };
  
  if (!isAuthenticated) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/50">
        <p>Необходимо войти в систему для просмотра задач</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-kira-purple rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  const filteredTasks = getFilteredAndSortedTasks();

  return (
    <div className="space-y-4 animate-fade-in">
      <TaskListHeader 
        onOpenCreateDialog={() => setIsCreateDialogOpen(true)} 
      />

      <TaskFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFiltersOpen={isFiltersOpen}
        setIsFiltersOpen={setIsFiltersOpen}
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onToggleSort={handleToggleSort}
      />

      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleCompletion={toggleTaskCompletion}
              onEdit={(taskId) => setEditingTask(taskId)}
              onDelete={deleteTask}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              updateTask={updateTask}
            />
          ))
        ) : (
          <div className="text-center p-6 border rounded-md bg-muted/20">
            {searchQuery || Object.keys(filter).length > 0 ? (
              <p className="text-muted-foreground">Задачи не найдены. Попробуйте изменить параметры поиска.</p>
            ) : (
              <p className="text-muted-foreground">У вас пока нет задач. Создайте первую!</p>
            )}
          </div>
        )}
      </div>

      <TaskCreateDialog 
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
        createTask={createTask}
      />
    </div>
  );
};

export default TaskList;
