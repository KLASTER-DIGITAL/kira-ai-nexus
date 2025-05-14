
import React from "react";
import { Button } from "@/components/ui/button";
import { SortAsc, SortDesc, CalendarIcon, Flag } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskSortButtonsProps {
  sortBy: "dueDate" | "priority" | "";
  sortDirection: "asc" | "desc";
  onToggleSort: (field: "dueDate" | "priority") => void;
}

const TaskSortButtons: React.FC<TaskSortButtonsProps> = ({
  sortBy,
  sortDirection,
  onToggleSort,
}) => {
  return (
    <TooltipProvider>
      {/* Due date sort */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={sortBy === "dueDate" ? "secondary" : "outline"} 
            size="icon"
            onClick={() => onToggleSort("dueDate")}
          >
            <CalendarIcon size={16} />
            {sortBy === "dueDate" && (
              <div className="absolute -top-1 -right-1 h-3 w-3">
                {sortDirection === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />}
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Сортировать по дате</p>
        </TooltipContent>
      </Tooltip>
      
      {/* Priority sort */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={sortBy === "priority" ? "secondary" : "outline"} 
            size="icon"
            onClick={() => onToggleSort("priority")}
            className="ml-1"
          >
            <Flag size={16} />
            {sortBy === "priority" && (
              <div className="absolute -top-1 -right-1 h-3 w-3">
                {sortDirection === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />}
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Сортировать по приоритету</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TaskSortButtons;
