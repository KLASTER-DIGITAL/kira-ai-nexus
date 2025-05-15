
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface TaskNodeProps {
  data: {
    node: {
      id: string;
      title: string;
      content?: string;
      tags?: string[];
      completed?: boolean;
    };
  };
  selected: boolean;
}

const TaskNode: React.FC<TaskNodeProps> = ({ data, selected }) => {
  const { node } = data;
  
  // Function to strip HTML tags for preview
  const stripHtml = (html?: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  // Get a short preview of the content
  const contentPreview = stripHtml(node.content)?.substring(0, 30);
  
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-md shadow-md transition-all bg-card border w-[180px]",
        selected ? "border-primary shadow-lg ring-1 ring-primary" : "border-border",
        node.completed ? "bg-muted/50" : "bg-blue-50 dark:bg-blue-950/30"
      )}
    >
      <div className="flex items-center gap-2">
        {node.completed ? (
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
        ) : (
          <div className="h-4 w-4 border border-blue-400 rounded-sm flex-shrink-0" />
        )}
        <div className={cn(
          "font-medium text-sm truncate", 
          node.completed && "line-through text-muted-foreground"
        )}>
          {node.title}
        </div>
      </div>
      
      {contentPreview && (
        <div className="text-xs text-muted-foreground mt-1 line-clamp-1 ml-6">
          {contentPreview}...
        </div>
      )}
      
      {/* Show tags if available */}
      {node.tags && node.tags.length > 0 && (
        <div className="flex flex-wrap mt-2 gap-1 ml-6">
          {node.tags.slice(0, 2).map((tag, index) => (
            <div
              key={index}
              className="bg-blue-100 dark:bg-blue-800/30 px-1.5 py-0.5 text-[10px] rounded"
            >
              {tag}
            </div>
          ))}
          {node.tags.length > 2 && (
            <div className="bg-blue-100 dark:bg-blue-800/30 px-1.5 py-0.5 text-[10px] rounded">
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
          backgroundColor: "#00a3ff",
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
          backgroundColor: "#00a3ff",
          border: "1px solid white",
        }}
        isConnectable={false}
      />
    </div>
  );
};

export default memo(TaskNode);
