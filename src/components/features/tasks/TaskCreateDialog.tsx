
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm, { TaskFormValues } from "./TaskForm";
import { format } from "date-fns";
import { Task } from "@/types/tasks";

interface TaskCreateDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'type'>) => void;
  categories?: string[];
}

const TaskCreateDialog: React.FC<TaskCreateDialogProps> = ({
  isOpen,
  setIsOpen,
  createTask,
  categories
}) => {
  const defaultValues: Partial<TaskFormValues> = {
    title: "",
    description: "",
    priority: "medium",
    tags: [],
    reminder: false,
    recurring: false
  };

  const onSubmit = (data: TaskFormValues) => {
    // Преобразуем данные формы в формат, ожидаемый API
    const taskData = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
      completed: false,
      content: {
        completed: false,
        tags: data.tags,
        category: data.category,
        reminder: data.reminder,
        recurring: data.recurring,
        recurring_type: data.recurring ? data.recurring_type : undefined
      }
    };
    
    createTask(taskData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Создать новую задачу</DialogTitle>
        </DialogHeader>
        <TaskForm 
          defaultValues={defaultValues} 
          onSubmit={onSubmit} 
          submitLabel="Создать задачу"
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateDialog;
