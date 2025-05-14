
import React, { useState } from 'react';
import { GripHorizontal, Maximize2, Minimize2, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ANIMATIONS } from '@/lib/animations';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card 
      className={cn(
        "h-full w-full",
        "transition-all duration-300 group hover:shadow-md",
        className,
        ANIMATIONS.fadeIn,
        "flex flex-col"
      )}
    >
      <CardHeader className="p-3 flex-row justify-between items-center space-y-0 border-b select-none">
        <div className="flex items-center gap-2">
          <GripHorizontal size={16} className="text-muted-foreground cursor-move" />
          <h3 className="font-medium text-base">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className="h-7 w-7 rounded-full hover:bg-accent"
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
                className="h-7 w-7 rounded-full hover:bg-accent"
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
              className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
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
