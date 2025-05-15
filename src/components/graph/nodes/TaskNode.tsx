
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskNodeProps {
  data: {
    label: string;
    dueDate?: string;
    priority?: 'high' | 'medium' | 'low';
    status?: 'todo' | 'in_progress' | 'done';
    tags?: string[];
  };
  isConnectable: boolean;
}

const TaskNode = ({ data, isConnectable }: TaskNodeProps) => {
  const { label, dueDate, priority, status, tags = [] } = data;
  
  const priorityColor = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  };
  
  const statusColor = {
    todo: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <Card className="min-w-[200px] max-w-[250px] border-blue-500/40 shadow-md">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <CheckSquare className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-sm truncate">{label}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {status && (
            <Badge variant="outline" className={cn("text-xs px-1.5 py-0", statusColor[status])}>
              {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
            </Badge>
          )}
          
          {priority && (
            <Badge variant="outline" className={cn("text-xs px-1.5 py-0", priorityColor[priority])}>
              {priority === 'high' ? 'High' : priority === 'medium' ? 'Medium' : 'Low'}
            </Badge>
          )}
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />
    </Card>
  );
};

export default memo(TaskNode);
