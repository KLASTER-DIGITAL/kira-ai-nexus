
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Task } from "@/types/tasks";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface TaskNodeProps {
  data: {
    task: Task;
  };
  selected: boolean;
}

const TaskNode: React.FC<TaskNodeProps> = ({ data, selected }) => {
  const { task } = data;
  
  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };
  
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg shadow-md transition-all bg-card border w-[180px]",
        selected ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="font-medium text-sm truncate">{task.title}</div>
      
      <div className="flex items-center gap-2 mt-2">
        {task.due_date && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
        
        <div className={cn(
          "px-1.5 py-0.5 text-xs rounded-sm",
          task.priority ? priorityColors[task.priority as keyof typeof priorityColors] : ""
        )}>
          {task.priority || "None"}
        </div>
      </div>
      
      {/* Show tags if available */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap mt-2 gap-1">
          {task.tags.slice(0, 2).map((tag, index) => (
            <div
              key={index}
              className="bg-muted px-1.5 py-0.5 text-[10px] rounded"
            >
              {tag}
            </div>
          ))}
          {task.tags.length > 2 && (
            <div className="bg-muted px-1.5 py-0.5 text-[10px] rounded">
              +{task.tags.length - 2}
            </div>
          )}
        </div>
      )}
      
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 6,
          height: 6,
          backgroundColor: "#3b82f6",
          border: "1px solid white",
        }}
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 6,
          height: 6,
          backgroundColor: "#3b82f6",
          border: "1px solid white",
        }}
        isConnectable={false}
      />
    </div>
  );
};

export default memo(TaskNode);
