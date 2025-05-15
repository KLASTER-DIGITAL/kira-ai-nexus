
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="space-y-4 p-4">
      <div>
        <h3 className="font-medium mb-2">Типы узлов</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-notes" className="flex items-center gap-2">
              Заметки
              <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                Заметки
              </Badge>
            </Label>
            <Switch
              id="show-notes"
              checked={settings.showNotes}
              onCheckedChange={() => toggleNodeTypeVisibility('notes')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-tasks" className="flex items-center gap-2">
              Задачи
              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Задачи
              </Badge>
            </Label>
            <Switch
              id="show-tasks"
              checked={settings.showTasks}
              onCheckedChange={() => toggleNodeTypeVisibility('tasks')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-events" className="flex items-center gap-2">
              События
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                События
              </Badge>
            </Label>
            <Switch
              id="show-events"
              checked={settings.showEvents}
              onCheckedChange={() => toggleNodeTypeVisibility('events')}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Настройки отображения</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-isolated">Показать изолированные узлы</Label>
          <Switch
            id="show-isolated"
            checked={settings.showIsolatedNodes}
            onCheckedChange={toggleIsolatedNodes}
          />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Фильтр по тегам</h3>
        {allTags.length > 0 ? (
          <ScrollArea className="h-40">
            <div className="flex flex-wrap gap-2 p-1">
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
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">Нет доступных тегов</p>
        )}
      </div>
      
      <Separator />
      
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          // Reset all filters
          selectedTags.forEach(tag => toggleTag(tag));
        }}
      >
        Сбросить фильтры
      </Button>
    </div>
  );
};

export default GraphFilterPanel;
