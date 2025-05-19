
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm, { TaskFormValues } from "./TaskForm";
import { Task } from "@/types/tasks";

interface TaskEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  task: Task;
  updateTask: (task: Partial<Task> & { id: string }) => void;
  categories?: string[];
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  isOpen,
  setIsOpen,
  task,
  updateTask,
  categories
}) => {
  // Безопасно получаем объект content, используя || {}
  const taskContent = task.content || {};
  
  const defaultValues: Partial<TaskFormValues> = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    tags: taskContent.tags || [],
    category: taskContent.category,
    reminder: taskContent.reminder || false,
    recurring: taskContent.recurring || false,
    recurring_type: taskContent.recurring_type
  };

  const onSubmit = (data: TaskFormValues) => {
    // Сохраняем существующий контент, если он есть
    const currentContent = task.content || {};
    
    updateTask({
      id: task.id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? data.dueDate.toISOString().split('T')[0] : undefined,
      content: {
        ...currentContent,
        tags: data.tags,
        category: data.category,
        reminder: data.reminder,
        recurring: data.recurring,
        recurring_type: data.recurring ? data.recurring_type : undefined
      }
    });
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
        </DialogHeader>
        <TaskForm 
          defaultValues={defaultValues} 
          onSubmit={onSubmit} 
          submitLabel="Сохранить изменения"
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
