
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Task } from "@/types/tasks";
import { getNodeColor, getNodeBorderColor } from "../utils/graphUtils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskNodeProps {
  data: {
    task: Task;
    label: string;
    type: string;
  };
  selected: boolean;
}

const TaskNode: React.FC<TaskNodeProps> = ({ data, selected }) => {
  const { task } = data;
  const nodeColor = getNodeColor('task');
  const nodeBorderColor = getNodeBorderColor('task');
  
  // Format the date
  const formattedDueDate = task.dueDate ? format(
    new Date(task.dueDate), 
    "d MMM yyyy", 
    { locale: ru }
  ) : null;
  
  // Check if task is completed
  const isCompleted = task.status === "completed";
  
  // Color based on priority
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };
  
  return (
    <div 
      className={cn(
        "px-3 py-2 rounded-md shadow-md bg-white dark:bg-slate-800 border-2",
        selected ? `border-orange-400` : `border-[${nodeBorderColor}]`,
        "min-w-[150px] max-w-[220px] transition-all"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center justify-between mb-1">
        <div className={cn("text-xs font-bold", getPriorityColor())}>
          {task.priority?.toUpperCase()}
        </div>
        {isCompleted && (
          <Check className="w-4 h-4 text-green-500" />
        )}
      </div>
      
      <div className="font-medium text-sm mb-1 line-clamp-2">
        {task.title}
      </div>
      
      {formattedDueDate && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Clock className="w-3 h-3 mr-1" />
          {formattedDueDate}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

export default TaskNode;
