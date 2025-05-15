
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventNodeProps {
  data: {
    label: string;
    date?: string;
    time?: string;
    tags?: string[];
  };
  isConnectable: boolean;
}

const EventNode = ({ data, isConnectable }: EventNodeProps) => {
  const { label, date, time, tags = [] } = data;

  return (
    <Card className="min-w-[200px] max-w-[250px] border-amber-500/40 shadow-md">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <span className="font-medium text-sm truncate">{label}</span>
        </div>
        
        {(date || time) && (
          <div className="text-xs text-muted-foreground">
            {date} {time && `• ${time}`}
          </div>
        )}
        
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
        className="w-2 h-2 bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-amber-500"
      />
    </Card>
  );
};

export default memo(EventNode);
