
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EventNodeProps {
  data: {
    event: {
      id: string;
      title: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      location?: string;
      tags?: string[];
    };
  };
  selected: boolean;
}

const EventNode: React.FC<EventNodeProps> = ({ data, selected }) => {
  const { event } = data;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg shadow-md transition-all",
        "border bg-card w-[220px]",
        selected ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-amber-500" />
        <div className="font-medium text-sm truncate">{event.title}</div>
      </div>
      
      {event.description && (
        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {event.description}
        </div>
      )}
      
      <div className="mt-2 text-xs">
        {event.start_date && (
          <div className="flex items-center">
            <span className="font-medium mr-1">Начало:</span>
            <span className="text-muted-foreground">{formatDate(event.start_date)}</span>
          </div>
        )}
        
        {event.end_date && (
          <div className="flex items-center">
            <span className="font-medium mr-1">Конец:</span>
            <span className="text-muted-foreground">{formatDate(event.end_date)}</span>
          </div>
        )}
        
        {event.location && (
          <div className="flex items-center">
            <span className="font-medium mr-1">Место:</span>
            <span className="text-muted-foreground truncate">{event.location}</span>
          </div>
        )}
      </div>
      
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
