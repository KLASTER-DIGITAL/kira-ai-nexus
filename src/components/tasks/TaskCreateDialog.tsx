
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm, { TaskFormValues } from "./TaskForm";
import { format } from "date-fns";
import { Task } from "@/types/tasks";

interface TaskCreateDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'type'>) => void;
}

const TaskCreateDialog: React.FC<TaskCreateDialogProps> = ({
  isOpen,
  setIsOpen,
  createTask
}) => {
  const defaultValues: TaskFormValues = {
    title: "",
    description: "",
    priority: "medium",
  };

  const onSubmit = (data: TaskFormValues) => {
    createTask({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
      completed: false,
    });
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую задачу</DialogTitle>
        </DialogHeader>
        <TaskForm 
          defaultValues={defaultValues} 
          onSubmit={onSubmit} 
          submitLabel="Создать задачу"
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateDialog;
