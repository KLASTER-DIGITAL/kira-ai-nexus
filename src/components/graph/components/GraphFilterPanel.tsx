
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Filter, Bookmark, Calendar, CheckSquare, NetworkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GraphFilterPanelProps {
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
          className={cn("flex items-center gap-1", 
            (selectedTags.length > 0 || 
            !settings.showNotes || 
            !settings.showTasks || 
            !settings.showEvents || 
            settings.showIsolatedNodes) && "border-primary"
          )}
        >
          <Filter className="h-4 w-4" />
          <span>Фильтры</span>
          {(selectedTags.length > 0 || 
            !settings.showNotes || 
            !settings.showTasks || 
            !settings.showEvents || 
            settings.showIsolatedNodes) && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {selectedTags.length + 
                (!settings.showNotes ? 1 : 0) + 
                (!settings.showTasks ? 1 : 0) + 
                (!settings.showEvents ? 1 : 0) +
                (settings.showIsolatedNodes ? 1 : 0)
              }
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Типы узлов</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={settings.showNotes ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => toggleNodeTypeVisibility('notes')}
              >
                <Bookmark className="h-4 w-4" />
                <span>Заметки</span>
              </Button>
              <Button
                variant={settings.showTasks ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => toggleNodeTypeVisibility('tasks')}
              >
                <CheckSquare className="h-4 w-4" />
                <span>Задачи</span>
              </Button>
              <Button
                variant={settings.showEvents ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => toggleNodeTypeVisibility('events')}
              >
                <Calendar className="h-4 w-4" />
                <span>События</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Дополнительно</h3>
            <Button
              variant={settings.showIsolatedNodes ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={toggleIsolatedNodes}
            >
              <NetworkIcon className="h-4 w-4" />
              <span>Изолированные узлы</span>
            </Button>
          </div>

          {allTags.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Теги</h3>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => toggleTag("")}
                  >
                    Сбросить
                  </Button>
                )}
              </div>
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
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
