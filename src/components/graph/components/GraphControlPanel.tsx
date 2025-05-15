
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutType } from '@/hooks/useGraphSettings';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RefreshCw,
  Grid3X3,
  Network,
  GitMerge,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GraphControlPanelProps {
  layout: LayoutType;
  onChangeLayout: (layout: LayoutType) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onResetView?: () => void;
}

const GraphControlPanel: React.FC<GraphControlPanelProps> = ({
  layout,
  onChangeLayout,
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetView,
}) => {
  const layouts: { type: LayoutType; icon: React.ReactNode; label: string }[] = [
    {
      type: 'force',
      icon: <Network size={16} />,
      label: 'Силовой',
    },
    {
      type: 'radial',
      icon: <Grid3X3 size={16} />,
      label: 'Радиальный',
    },
    {
      type: 'hierarchical',
      icon: <GitMerge size={16} />,
      label: 'Иерархический',
    },
  ];

  return (
    <div className="flex flex-col gap-2 bg-card p-2 rounded-lg border shadow-sm">
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onZoomIn}
            >
              <ZoomIn size={16} />
              <span className="sr-only">Приблизить</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Приблизить</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onZoomOut}
            >
              <ZoomOut size={16} />
              <span className="sr-only">Отдалить</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Отдалить</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onFitView}
            >
              <Maximize size={16} />
              <span className="sr-only">Вписать</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Вписать в окно</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onResetView}
            >
              <RefreshCw size={16} />
              <span className="sr-only">Сбросить</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Сбросить вид</TooltipContent>
        </Tooltip>
      </div>

      <div className="h-px bg-border my-1"></div>

      <div className="flex flex-col gap-1">
        {layouts.map((layoutOption) => (
          <Tooltip key={layoutOption.type}>
            <TooltipTrigger asChild>
              <Button
                variant={layout === layoutOption.type ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => onChangeLayout(layoutOption.type)}
              >
                {layoutOption.icon}
                <span className="sr-only">{layoutOption.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{layoutOption.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default GraphControlPanel;
