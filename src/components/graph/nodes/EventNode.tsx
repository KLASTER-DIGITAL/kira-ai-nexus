
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { getNodeColor, getNodeBorderColor } from "../utils/graphUtils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventNodeProps {
  data: {
    event: any;
    label: string;
    type: string;
  };
  selected: boolean;
}

const EventNode: React.FC<EventNodeProps> = ({ data, selected }) => {
  const { event } = data;
  const nodeColor = getNodeColor('event');
  const nodeBorderColor = getNodeBorderColor('event');
  
  // Format the date if available
  const formattedStartDate = event?.startDate ? format(
    new Date(event.startDate), 
    "d MMM yyyy HH:mm", 
    { locale: ru }
  ) : null;
  
  return (
    <div 
      className={cn(
        "px-3 py-2 rounded-md shadow-md bg-white dark:bg-slate-800 border-2",
        selected ? `border-orange-400` : `border-[${nodeBorderColor}]`,
        "min-w-[150px] max-w-[220px] transition-all"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center gap-1 mb-1">
        <Calendar className="w-4 h-4 text-blue-500" />
        <div className="text-xs font-medium text-blue-500">
          EVENT
        </div>
      </div>
      
      <div className="font-medium text-sm mb-1 line-clamp-2">
        {data.label}
      </div>
      
      {formattedStartDate && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formattedStartDate}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

export default EventNode;
