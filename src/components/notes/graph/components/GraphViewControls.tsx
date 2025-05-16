
import React, { useState } from "react";
import { ZoomIn, ZoomOut, Maximize, Minimize, LayoutGrid, CircleDashed, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useReactFlow } from "@xyflow/react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LayoutType } from "@/hooks/useGraphSettings";
import useFullscreen from "../hooks/useFullscreen";

interface GraphViewControlsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  selectedLayout: LayoutType;
  onChangeLayout: (layout: LayoutType) => void;
  onReset: () => void;
}

const GraphViewControls: React.FC<GraphViewControlsProps> = ({
  containerRef,
  selectedLayout,
  onChangeLayout,
  onReset
}) => {
  const reactFlowInstance = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  // Update zoom level when zooming
  const handleZoomIn = () => {
    reactFlowInstance.zoomIn();
    setZoomLevel(Math.round(reactFlowInstance.getZoom() * 100) / 100);
  };

  const handleZoomOut = () => {
    reactFlowInstance.zoomOut();
    setZoomLevel(Math.round(reactFlowInstance.getZoom() * 100) / 100);
  };

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
    setTimeout(() => {
      setZoomLevel(Math.round(reactFlowInstance.getZoom() * 100) / 100);
    }, 800);
  };

  // Update zoom level on mount and when zoom changes
  React.useEffect(() => {
    const zoom = reactFlowInstance.getZoom();
    setZoomLevel(Math.round(zoom * 100) / 100);

    const onZoomChange = () => {
      setZoomLevel(Math.round(reactFlowInstance.getZoom() * 100) / 100);
    };

    // Add event listener for zoom changes
    const container = document.querySelector('.react-flow__zoompane');
    if (container) {
      container.addEventListener('wheel', onZoomChange);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', onZoomChange);
      }
    };
  }, [reactFlowInstance]);

  return (
    <div className="flex flex-col gap-2 bg-card rounded-md shadow-sm p-2">
      {/* Zoom controls */}
      <div className="flex flex-col gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="h-8 flex items-center justify-center">
                {`${Math.round(zoomLevel * 100)}%`}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Текущий масштаб</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Увеличить (Alt+Plus)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Уменьшить (Alt+Minus)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleFitView}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>По размеру экрана (Alt+0)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="h-px bg-border my-1" />

      {/* Layout controls */}
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {selectedLayout === 'force' && <Network className="h-4 w-4" />}
                  {selectedLayout === 'radial' && <CircleDashed className="h-4 w-4" />}
                  {selectedLayout === 'hierarchical' && <LayoutGrid className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Изменить тип расположения</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
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

      <div className="h-px bg-border my-1" />

      {/* Fullscreen toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="h-px bg-border my-1" />
      
      {/* Reset button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onReset}
            >
              <Network className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Перерасчет графа (Alt+R)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default GraphViewControls;
