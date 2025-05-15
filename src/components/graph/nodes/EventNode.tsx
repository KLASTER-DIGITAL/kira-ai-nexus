
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface EventNodeProps {
  data: {
    label: string;
    color: string;
    date?: string;
    time?: string;
    tags?: string[];
  };
  selected: boolean;
}

export const EventNode: React.FC<EventNodeProps> = ({ data, selected }) => {
  const { label, color, date, time, tags = [] } = data;

  const formattedDate = date ? format(new Date(date), 'MMM d') : null;

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
      
      <div className="font-bold truncate mb-1">{label}</div>
      
      <div className="flex flex-wrap gap-2 text-xs text-gray-700">
        {formattedDate && (
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
        )}
        
        {time && (
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{time}</span>
          </div>
        )}
      </div>
      
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

export default EventNode;
