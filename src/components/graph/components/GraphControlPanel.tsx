
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutGrid, 
  CircleDashed, 
  Network 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LayoutType } from '@/hooks/useGraphSettings';

interface GraphControlPanelProps {
  layout: LayoutType;
  onChangeLayout: (layout: LayoutType) => void;
}

const GraphControlPanel: React.FC<GraphControlPanelProps> = ({ 
  layout, 
  onChangeLayout 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {layout === 'force' && <Network className="h-4 w-4" />}
          {layout === 'radial' && <CircleDashed className="h-4 w-4" />}
          {layout === 'hierarchical' && <LayoutGrid className="h-4 w-4" />}
          <span>Расположение</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Тип расположения</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => onChangeLayout('force')}
          className="flex items-center gap-2"
        >
          <Network className="h-4 w-4" />
          <span>Силовое</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onChangeLayout('radial')}
          className="flex items-center gap-2"
        >
          <CircleDashed className="h-4 w-4" />
          <span>Радиальное</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onChangeLayout('hierarchical')}
          className="flex items-center gap-2"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Иерархическое</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GraphControlPanel;
