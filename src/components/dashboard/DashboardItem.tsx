
import React, { useState } from 'react';
import { Grip, MoreVertical, Maximize2, Minimize2, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ANIMATIONS } from '@/lib/animations';
import { Card } from '@/components/ui/card';

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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card 
      className={`
        kira-dashboard-item
        h-full w-full
        ${className}
        transition-all duration-300 hover:shadow-md
        ${ANIMATIONS.slideIn}
        flex flex-col
      `}
    >
      <div className="kira-dashboard-item-header p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Grip size={16} className="text-muted-foreground kira-draggable cursor-move" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className="hover:bg-kira-purple/10 transition-colors"
            aria-label={collapsed ? "Развернуть" : "Свернуть содержимое"}
            title={collapsed ? "Развернуть" : "Свернуть содержимое"}
          >
            {collapsed ? (
              <Maximize2 size={15} />
            ) : (
              <Minimize2 size={15} />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-kira-purple/10 transition-colors"
                aria-label="Настройки"
              >
                <Settings size={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span>Настроить</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Обновить</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive" 
                onClick={onRemove}
              >
                <span>Удалить</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {onRemove && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRemove}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Удалить"
              title="Удалить"
            >
              <X size={15} />
            </Button>
          )}
        </div>
      </div>
      
      <div 
        className={`
          p-3 flex-1 overflow-auto
          transition-all duration-300
          ${collapsed ? 'h-0 p-0 opacity-0' : 'opacity-100'}
        `}
      >
        {!collapsed && children}
      </div>
    </Card>
  );
};

export default DashboardItem;
