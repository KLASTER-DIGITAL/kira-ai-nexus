
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Calendar, Flag } from "lucide-react";

interface TaskSortButtonsProps {
  sortBy: "dueDate" | "priority" | "";
  sortDirection: "asc" | "desc";
  onToggleSort: (field: "dueDate" | "priority") => void;
}

const TaskSortButtons: React.FC<TaskSortButtonsProps> = ({
  sortBy,
  sortDirection,
  onToggleSort
}) => {
  // Get the arrow icon based on sort direction
  const getArrowIcon = () => {
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />;
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={sortBy === "dueDate" ? "secondary" : "outline"}
        size="sm"
        className="h-9"
        onClick={() => onToggleSort("dueDate")}
      >
        <Calendar className="mr-1 h-3.5 w-3.5" />
        Срок
        {sortBy === "dueDate" && getArrowIcon()}
      </Button>

      <Button
        variant={sortBy === "priority" ? "secondary" : "outline"}
        size="sm"
        className="h-9"
        onClick={() => onToggleSort("priority")}
      >
        <Flag className="mr-1 h-3.5 w-3.5" />
        Приоритет
        {sortBy === "priority" && getArrowIcon()}
      </Button>
    </div>
  );
};

export default TaskSortButtons;
