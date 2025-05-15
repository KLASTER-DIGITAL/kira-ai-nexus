
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Task } from '@/types/tasks';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskNodeProps {
  data: {
    label: string;
    color: string;
    due_date?: string;
    priority?: 'high' | 'medium' | 'low';
    status?: 'todo' | 'in_progress' | 'done';
    tags?: string[];
  };
  selected: boolean;
}

export const TaskNode: React.FC<TaskNodeProps> = ({ data, selected }) => {
  const { label, color, due_date, priority, tags = [] } = data;

  // Map priority to style
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  // Map status to icon
  const StatusIcon = data.status === 'done' 
    ? CheckCircle 
    : data.status === 'in_progress' 
      ? Clock
      : XCircle;

  return (
    <div
      className={`px-4 py-2 rounded-md shadow-md transition-all ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{ 
        backgroundColor: color,
        minWidth: '180px',
        maxWidth: '250px'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {priority && (
            <div className={`w-2 h-2 rounded-full mr-2 ${priorityColors[priority]}`} />
          )}
          <StatusIcon className="w-4 h-4 mr-2 text-gray-700" />
          <div className="font-bold truncate">{label}</div>
        </div>
      </div>
      
      {due_date && (
        <div className="flex items-center text-xs text-gray-700 mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{format(new Date(due_date), 'MMM d')}</span>
        </div>
      )}
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.slice(0, 2).map((tag, i) => (
            <span 
              key={i}
              className="px-1.5 py-0.5 bg-white/30 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="px-1.5 py-0.5 bg-white/30 rounded text-xs">
              +{tags.length - 2}
            </span>
          )}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};

export default TaskNode;
