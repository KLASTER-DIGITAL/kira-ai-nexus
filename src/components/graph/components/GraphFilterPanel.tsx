
import React from 'react';
import { X } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GraphFilterPanelProps {
  showNotes: boolean;
  showTasks: boolean;
  showEvents: boolean;
  showIsolatedNodes: boolean;
  availableTags: string[];
  selectedTags: string[];
  onToggleNotes: () => void;
  onToggleTasks: () => void;
  onToggleEvents: () => void;
  onToggleIsolatedNodes: () => void;
  onUpdateSelectedTags: (tags: string[]) => void;
}

export function GraphFilterPanel({
  showNotes,
  showTasks,
  showEvents,
  showIsolatedNodes,
  availableTags,
  selectedTags,
  onToggleNotes,
  onToggleTasks,
  onToggleEvents,
  onToggleIsolatedNodes,
  onUpdateSelectedTags
}: GraphFilterPanelProps) {
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onUpdateSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      onUpdateSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all selected tags
  const clearTagSelection = () => {
    onUpdateSelectedTags([]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Node type toggles */}
      <Button
        variant={showNotes ? "default" : "outline"}
        size="sm"
        onClick={onToggleNotes}
        className="text-xs"
      >
        Заметки
      </Button>
      
      <Button
        variant={showTasks ? "default" : "outline"}
        size="sm"
        onClick={onToggleTasks}
        className="text-xs"
      >
        Задачи
      </Button>
      
      <Button
        variant={showEvents ? "default" : "outline"}
        size="sm"
        onClick={onToggleEvents}
        className="text-xs"
      >
        События
      </Button>

      <Button
        variant={showIsolatedNodes ? "default" : "outline"}
        size="sm"
        onClick={onToggleIsolatedNodes}
        className="text-xs"
      >
        Изолированные
      </Button>

      {/* Tag filter popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            Теги {selectedTags.length > 0 && `(${selectedTags.length})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-60 p-2">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Фильтр по тегам</h4>
            {selectedTags.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearTagSelection}
                className="h-6 px-2 text-xs"
              >
                Очистить все
              </Button>
            )}
          </div>
          
          <Separator className="my-2" />
          
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  {tag}
                  <X 
                    size={12} 
                    className="cursor-pointer" 
                    onClick={() => handleTagSelect(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
          
          <ScrollArea className="h-60">
            {availableTags.length > 0 ? (
              <div className="space-y-2">
                {availableTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagSelect(tag)}
                    />
                    <label 
                      htmlFor={`tag-${tag}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground p-1">Нет доступных тегов</p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
