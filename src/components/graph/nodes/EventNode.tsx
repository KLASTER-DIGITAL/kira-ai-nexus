
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

interface EventNodeProps {
  data: {
    node: {
      id: string;
      title: string;
      content?: string;
      tags?: string[];
      start_date?: string;
      end_date?: string;
    };
  };
  selected: boolean;
}

const EventNode: React.FC<EventNodeProps> = ({ data, selected }) => {
  const { node } = data;
  
  // Parse dates
  const startDate = node.start_date ? parseISO(node.start_date) : null;
  const formattedDate = startDate && isValid(startDate) 
    ? format(startDate, 'dd.MM.yyyy HH:mm') 
    : '';
  
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg shadow-md transition-all border w-[180px]",
        selected ? "border-primary shadow-lg ring-1 ring-primary" : "border-border",
        "bg-rose-50 dark:bg-rose-900/20"
      )}
    >
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-rose-600 flex-shrink-0" />
        <div className="font-medium text-sm truncate">
          {node.title}
        </div>
      </div>
      
      {formattedDate && (
        <div className="text-xs text-muted-foreground mt-1 ml-6">
          {formattedDate}
        </div>
      )}
      
      {/* Show tags if available */}
      {node.tags && node.tags.length > 0 && (
        <div className="flex flex-wrap mt-2 gap-1 ml-6">
          {node.tags.slice(0, 2).map((tag, index) => (
            <div
              key={index}
              className="bg-rose-100 dark:bg-rose-800/30 px-1.5 py-0.5 text-[10px] rounded"
            >
              {tag}
            </div>
          ))}
          {node.tags.length > 2 && (
            <div className="bg-rose-100 dark:bg-rose-800/30 px-1.5 py-0.5 text-[10px] rounded">
              +{node.tags.length - 2}
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
          backgroundColor: "#ff6b6b",
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
          backgroundColor: "#ff6b6b",
          border: "1px solid white",
        }}
        isConnectable={false}
      />
    </div>
  );
};

export default memo(EventNode);
