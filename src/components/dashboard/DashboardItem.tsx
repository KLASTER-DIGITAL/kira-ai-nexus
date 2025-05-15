
import React, { useState } from 'react';
import { Grip, MoreVertical, Maximize2, Minimize2, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ANIMATIONS } from '@/lib/animations';
import { useDashboardStore } from '@/store/dashboardStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '@/context/auth';

interface DashboardItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardItem: React.FC<DashboardItemProps> = ({ 
  id,
  title, 
  children,
  className = ""
}) => {
  const [expanded, setExpanded] = useState(false);
  const { toggleWidgetVisibility, saveUserLayout } = useDashboardStore();
  const { user } = useAuth();

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleHideWidget = () => {
    toggleWidgetVisibility(id);
    if (user?.id) {
      setTimeout(() => saveUserLayout(user.id), 0);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`
        kira-dashboard-item
        ${expanded ? 'md:col-span-full' : ''}
        ${className}
        transition-all duration-300 hover:shadow-md
        ${ANIMATIONS.slideIn}
        ${isDragging ? 'shadow-lg ring-2 ring-kira-purple/50' : ''}
        bg-white dark:bg-card rounded-lg border border-border shadow-sm
      `}
    >
      <div className="kira-dashboard-item-header p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div 
            className="text-muted-foreground cursor-grab active:cursor-grabbing hover:text-kira-purple"
            {...attributes}
            {...listeners}
          >
            <Grip size={16} />
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(!expanded)} 
            className="hover:bg-kira-purple/10 transition-colors"
          >
            {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-kira-purple/10 transition-colors"
              >
                <MoreVertical size={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setExpanded(!expanded)}>
                {expanded ? "Свернуть" : "Развернуть"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleHideWidget}>
                <EyeOff size={14} className="mr-2" />
                <span>Скрыть виджет</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-3 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardItem;
