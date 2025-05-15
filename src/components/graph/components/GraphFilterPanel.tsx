
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckSquare, Filter, Calendar, StickyNote, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface GraphFilterPanelProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  settings: {
    showNotes: boolean;
    showTasks: boolean;
    showEvents: boolean;
    showIsolatedNodes: boolean;
  };
  toggleNodeTypeVisibility: (type: 'notes' | 'tasks' | 'events') => void;
  toggleIsolatedNodes: () => void;
}

export const GraphFilterPanel: React.FC<GraphFilterPanelProps> = ({
  selectedTags,
  toggleTag,
  allTags,
  settings,
  toggleNodeTypeVisibility,
  toggleIsolatedNodes,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className={`gap-1 h-9 ${selectedTags.length > 0 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
        >
          <Filter className="h-4 w-4" />
          <span>Фильтры</span>
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="ml-1 bg-primary-foreground text-primary">
              {selectedTags.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Типы узлов</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-notes" 
                checked={settings.showNotes}
                onCheckedChange={() => toggleNodeTypeVisibility('notes')}
              />
              <Label htmlFor="show-notes" className="flex items-center gap-1">
                <StickyNote className="h-4 w-4 text-emerald-500" />
                <span>Заметки</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-tasks" 
                checked={settings.showTasks}
                onCheckedChange={() => toggleNodeTypeVisibility('tasks')}
              />
              <Label htmlFor="show-tasks" className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4 text-blue-500" />
                <span>Задачи</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-events" 
                checked={settings.showEvents}
                onCheckedChange={() => toggleNodeTypeVisibility('events')}
              />
              <Label htmlFor="show-events" className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span>События</span>
              </Label>
            </div>
          </div>
          
          <Separator />
          
          <h4 className="font-medium">Отображение</h4>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-isolated" 
              checked={settings.showIsolatedNodes}
              onCheckedChange={toggleIsolatedNodes}
            />
            <Label htmlFor="show-isolated" className="flex items-center gap-1">
              {settings.showIsolatedNodes ? (
                <Eye className="h-4 w-4 text-slate-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-slate-500" />
              )}
              <span>Показывать изолированные узлы</span>
            </Label>
          </div>
          
          <Separator />
          
          {allTags.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Теги</h4>
                {selectedTags.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleTag("")}
                    className="h-8 px-2 text-xs"
                  >
                    Сбросить
                  </Button>
                )}
              </div>
              <ScrollArea className="h-44">
                <div className="flex flex-wrap gap-1">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      className={`cursor-pointer ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
