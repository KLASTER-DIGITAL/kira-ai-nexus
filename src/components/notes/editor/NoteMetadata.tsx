
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import ColorPicker from "../ColorPicker";
import { ShareIcon, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NoteMetadataProps {
  title: string;
  onTitleChange: (title: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  isSaving?: boolean;
  lastSavedAt?: Date | null;
  onToggleGraph?: () => void;
  showGraph?: boolean;
}

const NoteMetadata: React.FC<NoteMetadataProps> = ({
  title,
  onTitleChange,
  color,
  onColorChange,
  isSaving = false,
  lastSavedAt = null,
  onToggleGraph,
  showGraph = false
}) => {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Заголовок заметки"
            className="text-lg font-medium border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Toggle graph view button */}
          {onToggleGraph && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showGraph ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={onToggleGraph}
                  >
                    <Network className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showGraph ? 'Скрыть связи' : 'Показать связи'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Share button (placeholder) */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShareOpen(true)}
                >
                  <ShareIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Поделиться</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <ColorPicker 
            color={color} 
            onColorChange={onColorChange}
          />
        </div>
      </div>
      
      {/* Save status */}
      {(isSaving || lastSavedAt) && (
        <div className="text-xs text-muted-foreground">
          {isSaving ? (
            "Сохранение..."
          ) : lastSavedAt ? (
            <span>Сохранено: {format(lastSavedAt, "HH:mm:ss")}</span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NoteMetadata;
