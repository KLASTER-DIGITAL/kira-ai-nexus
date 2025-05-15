
import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GraphFilterPopoverProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  showIsolatedNodes: boolean;
  setShowIsolatedNodes: (value: boolean) => void;
}

const GraphFilterPopover: React.FC<GraphFilterPopoverProps> = ({
  selectedTags,
  toggleTag,
  allTags,
  showIsolatedNodes,
  setShowIsolatedNodes,
}) => {
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-1" />
                <span>Фильтры</span>
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{selectedTags.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Фильтровать по тегам</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <PopoverContent className="w-[200px] p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Фильтры графа</h4>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showIsolated" 
                checked={showIsolatedNodes} 
                onCheckedChange={(checked) => 
                  setShowIsolatedNodes(checked === true)
                } 
              />
              <Label htmlFor="showIsolated">Показывать изолированные</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-muted-foreground">Теги</h5>
            <div className="flex flex-wrap gap-1">
              {allTags.map((tag) => (
                <Badge 
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {selectedTags.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 h-7 text-xs"
                onClick={() => toggleTag("")}
              >
                Сбросить фильтры
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GraphFilterPopover;
