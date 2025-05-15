
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TaskNodeProps {
  data: {
    task: {
      id: string;
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      due_date?: string;
      status?: 'todo' | 'in_progress' | 'done';
      tags?: string[];
    };
  };
  selected: boolean;
}

const priorityColors = {
  low: 'bg-slate-200',
  medium: 'bg-blue-200',
  high: 'bg-amber-200',
  urgent: 'bg-red-200'
};

const statusColors = {
  todo: 'bg-slate-100 text-slate-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800'
};

const TaskNode: React.FC<TaskNodeProps> = ({ data, selected }) => {
  const { task } = data;
  
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg shadow-md transition-all",
        "border bg-card w-[220px]",
        selected ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="font-medium text-sm truncate max-w-[160px]">{task.title}</div>
        
        {task.priority && (
          <div 
            className={cn(
              "h-3 w-3 rounded-full",
              priorityColors[task.priority]
            )} 
          />
        )}
      </div>
      
      {task.description && (
        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {task.description}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-2">
        {task.status && (
          <Badge variant="outline" className={cn("text-[10px] font-normal", statusColors[task.status])}>
            {task.status === 'todo' ? 'К выполнению' : 
             task.status === 'in_progress' ? 'В процессе' : 'Выполнено'}
          </Badge>
        )}
        
        {task.due_date && (
          <Badge variant="outline" className="text-[10px] font-normal bg-slate-50">
            {new Date(task.due_date).toLocaleDateString()}
          </Badge>
        )}
      </div>
      
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
