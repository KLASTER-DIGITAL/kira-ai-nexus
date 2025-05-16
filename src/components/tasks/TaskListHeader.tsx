
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskListHeaderProps {
  onOpenCreateDialog: () => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ onOpenCreateDialog }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Мои задачи</h2>
      <Button 
        className="bg-primary hover:bg-primary/80 text-primary-foreground transition-colors"
        onClick={onOpenCreateDialog}
      >
        <Plus size={16} className="mr-1" /> Добавить задачу
      </Button>
    </div>
  );
};

export default TaskListHeader;
