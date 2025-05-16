
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Search, Tag, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface GraphToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  showIsolatedNodes: boolean;
  setShowIsolatedNodes: (value: boolean) => void;
  hasFilters: boolean;
  clearFilters: () => void;
}

const GraphToolbar: React.FC<GraphToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTags,
  toggleTag,
  allTags,
  showIsolatedNodes,
  setShowIsolatedNodes,
  hasFilters,
  clearFilters
}) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-md shadow-sm">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {/* Tags filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span className="hidden sm:inline">Теги</span>
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium">Фильтр по тегам</h4>
            {allTags.length > 0 ? (
              <div className="max-h-60 overflow-y-auto space-y-1">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Нет доступных тегов</p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Isolated nodes toggle */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Фильтры</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium">Настройки отображения</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isolated-nodes"
                checked={showIsolatedNodes}
                onCheckedChange={(checked) => setShowIsolatedNodes(checked === true)}
              />
              <label
                htmlFor="isolated-nodes"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Показывать изолированные узлы
              </label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Reset filters */}
      {hasFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden sm:inline">Сбросить</span>
        </Button>
      )}
    </div>
  );
};

export default GraphToolbar;
