
import React from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  allTags: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchText,
  setSearchText,
  selectedTags,
  toggleTag,
  clearFilters,
  allTags,
}) => {
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

  return (
    <>
      {/* Search and filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск заметок..."
            className="pl-9 pr-9"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 relative">
              <Filter className="h-4 w-4" />
              {selectedTags.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Фильтр по тегам</span>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchText("")}
                  >
                    Сбросить
                  </Button>
                )}
              </div>

              {allTags.length > 0 ? (
                <ScrollArea className="h-60">
                  <div className="space-y-1">
                    {allTags.map((tag) => (
                      <div
                        key={tag}
                        className={`flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-accent ${
                          selectedTags.includes(tag) ? "bg-accent" : ""
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        <div className="flex-1">
                          <Badge
                            variant={
                              selectedTags.includes(tag) ? "default" : "outline"
                            }
                          >
                            {tag}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="py-2 text-center text-sm text-muted-foreground">
                  Нет доступных тегов
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Активные фильтры:
          </span>

          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6"
            >
              Сбросить все
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default FilterBar;
