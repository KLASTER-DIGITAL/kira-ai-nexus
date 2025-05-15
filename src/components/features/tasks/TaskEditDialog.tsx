
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm, { TaskFormValues } from "./TaskForm";
import { format } from "date-fns";
import { Task } from "@/types/tasks";

interface TaskEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  task: Task;
  updateTask: (task: Partial<Task> & { id: string }) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  isOpen,
  setIsOpen,
  task,
  updateTask
}) => {
  const defaultValues: TaskFormValues = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  };

  const onSubmit = (data: TaskFormValues) => {
    updateTask({
      id: task.id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
    });
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
        </DialogHeader>
        <TaskForm 
          defaultValues={defaultValues} 
          onSubmit={onSubmit} 
          submitLabel="Сохранить изменения"
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
