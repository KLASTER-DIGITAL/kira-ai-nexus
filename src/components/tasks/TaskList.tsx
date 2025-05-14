
import React, { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskFilter } from "@/types/tasks";
import { useAuth } from "@/context/auth";
import TaskListHeader from "./TaskListHeader";
import TaskFilters from "./TaskFilters";
import TaskCreateDialog from "./TaskCreateDialog";
import TaskListContainer from "./TaskListContainer";
import { useTaskFiltering } from "@/hooks/tasks/useTaskFiltering";

const TaskList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<TaskFilter>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { tasks, isLoading, toggleTaskCompletion, createTask, updateTask, deleteTask } = useTasks(filter);
  
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDirection,
    handleToggleSort,
    filteredAndSortedTasks,
    isSearching
  } = useTaskFiltering(tasks);
  
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

      <TaskListContainer 
        tasks={filteredAndSortedTasks}
        isSearching={isSearching || Object.keys(filter).length > 0}
        toggleTaskCompletion={toggleTaskCompletion}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />

      <TaskCreateDialog 
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
        createTask={createTask}
      />
    </div>
  );
};

export default TaskList;
