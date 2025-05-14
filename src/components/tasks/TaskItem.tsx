
import React from "react";
import { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Edit, Trash2 } from "lucide-react";
import { getPriorityBadgeClass, getPriorityLabel } from "./TaskPriorityUtils";
import TaskEditDialog from "./TaskEditDialog";

interface TaskItemProps {
  task: Task;
  onToggleCompletion: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  editingTask: string | null;
  setEditingTask: (taskId: string | null) => void;
  updateTask: (task: Partial<Task> & { id: string }) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onEdit,
  onDelete,
  editingTask,
  setEditingTask,
  updateTask
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-md transition-all duration-200 transform hover:translate-y-[-2px] ${
        task.completed
          ? "bg-muted/50 border-muted"
          : "bg-card border-border hover:shadow-sm"
      }`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleCompletion(task.id)}
        className={`h-5 w-5 rounded-full transition-colors ${
          task.completed
            ? "bg-kira-purple border-kira-purple text-white"
            : "border-muted-foreground hover:border-kira-purple"
        }`}
      />
      <div className="flex-1 flex flex-col">
        <span
          className={`${
            task.completed ? "line-through text-muted-foreground" : "font-medium"
          }`}
        >
          {task.title}
        </span>
        {task.description && (
          <span className="text-sm text-muted-foreground line-clamp-1">
            {task.description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span 
          className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeClass(task.priority)}`}
        >
          {getPriorityLabel(task.priority)}
        </span>
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock size={12} className="mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(task.id)}
        >
          <Edit size={14} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      <TaskEditDialog
        isOpen={editingTask === task.id}
        setIsOpen={() => setEditingTask(null)}
        task={task}
        updateTask={updateTask}
      />
    </div>
  );
};

export default TaskItem;
