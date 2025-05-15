
import React from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GraphControlPanelProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onReset: () => void;
}

const GraphControlPanel: React.FC<GraphControlPanelProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onReset,
}) => {
  return (
    <Panel position="top-right" className="bg-card shadow-sm rounded-md p-2">
      <div className="flex flex-col gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
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
                onClick={onZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
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
                onClick={onFitView}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>По размеру экрана (Alt+0)</p>
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
                onClick={onReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Сбросить (Alt+R)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Panel>
  );
};

export default GraphControlPanel;
