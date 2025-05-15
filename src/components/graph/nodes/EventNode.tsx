
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  description?: string;
  tags?: string[];
}

interface EventNodeProps {
  data: {
    event: Event;
  };
  selected: boolean;
}

const EventNode: React.FC<EventNodeProps> = ({ data, selected }) => {
  const { event } = data;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg shadow-md transition-all bg-card border w-[180px]",
        selected ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="font-medium text-sm truncate">{event.title}</div>
      
      {event.start_date && (
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(event.start_date)}</span>
        </div>
      )}
      
      {/* Show tags if available */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap mt-2 gap-1">
          {event.tags.slice(0, 2).map((tag, index) => (
            <div
              key={index}
              className="bg-muted px-1.5 py-0.5 text-[10px] rounded"
            >
              {tag}
            </div>
          ))}
          {event.tags.length > 2 && (
            <div className="bg-muted px-1.5 py-0.5 text-[10px] rounded">
              +{event.tags.length - 2}
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
          backgroundColor: "#f59e0b",
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
          backgroundColor: "#f59e0b",
          border: "1px solid white",
        }}
        isConnectable={false}
      />
    </div>
  );
};

export default memo(EventNode);
