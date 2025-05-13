
import React, { useState } from 'react';
import { Grip, MoreVertical, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface DashboardItemProps {
  title: string;
  onRemove?: () => void;
  children: React.ReactNode;
  className?: string;
}

const DashboardItem: React.FC<DashboardItemProps> = ({ 
  title, 
  onRemove,
  children,
  className = ""
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className={`
        kira-dashboard-item
        ${expanded ? 'col-span-full row-span-2' : ''}
        ${className}
      `}
    >
      <div className="kira-dashboard-item-header">
        <div className="flex items-center gap-2">
          <Grip size={16} className="text-muted-foreground kira-draggable" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
            {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Настроить</DropdownMenuItem>
              <DropdownMenuItem>Обновить</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={onRemove}>
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {onRemove && (
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <X size={15} />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardItem;
