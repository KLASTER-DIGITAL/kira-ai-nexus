
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
      className={cn(
        "kira-dashboard-item h-full w-full",
        "transition-all duration-300 hover:shadow-md border-muted/40",
        className,
        ANIMATIONS.slideIn,
        "flex flex-col"
      )}
    >
      <CardHeader className="kira-dashboard-item-header p-3 flex-row justify-between items-center space-y-0">
        <div className="flex items-center gap-2">
          <Grip size={16} className="text-muted-foreground kira-draggable cursor-move" />
          <h3 className="font-medium text-base">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className="hover:bg-kira-purple/10 transition-colors rounded-full h-7 w-7"
            aria-label={collapsed ? "Развернуть" : "Свернуть содержимое"}
            title={collapsed ? "Развернуть" : "Свернуть содержимое"}
          >
            {collapsed ? (
              <Maximize2 size={14} />
            ) : (
              <Minimize2 size={14} />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-kira-purple/10 transition-colors rounded-full h-7 w-7"
                aria-label="Настройки"
              >
                <Settings size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <span>Настроить виджет</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Обновить данные</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive" 
                onClick={onRemove}
              >
                <span>Удалить виджет</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {onRemove && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRemove}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full h-7 w-7"
              aria-label="Удалить"
              title="Удалить"
            >
              <X size={14} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent
        className={cn(
          "p-3 flex-1 overflow-auto",
          "transition-all duration-300",
          collapsed ? 'h-0 p-0 opacity-0' : 'opacity-100'
        )}
      >
        {!collapsed && children}
      </CardContent>
    </Card>
  );
};

export default DashboardItem;
