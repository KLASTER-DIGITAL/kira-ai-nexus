
import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SortOption, GroupByOption } from "@/hooks/notes/types";

interface FilterBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  allTags: string[];
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  groupByOption: GroupByOption;
  setGroupByOption: (option: GroupByOption) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchText,
  setSearchText,
  selectedTags,
  toggleTag,
  clearFilters,
  allTags,
  sortOption,
  setSortOption,
  groupByOption,
  setGroupByOption
}) => {
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск заметок..."
          className="pl-8 pr-8"
          value={searchText}
          onChange={handleSearchChange}
        />
        {searchText && (
          <button
            className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {/* Selected Tags */}
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => toggleTag(tag)}
          >
            {tag} <X className="ml-1 h-3 w-3" />
          </Badge>
        ))}

        {/* Filter/Sort Controls */}
        <div className="flex-grow"></div>
        <div className="flex gap-2 items-center">
          {/* Tag Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Теги
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 max-h-80 overflow-y-auto p-2">
              {allTags.length > 0 ? (
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
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  Нет доступных тегов
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Sort Option */}
          <div className="min-w-[140px]">
            <Select 
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_desc">Сначала новые</SelectItem>
                <SelectItem value="created_asc">Сначала старые</SelectItem>
                <SelectItem value="updated_desc">По дате обновления</SelectItem>
                <SelectItem value="title_asc">По алфавиту (А-Я)</SelectItem>
                <SelectItem value="title_desc">По алфавиту (Я-А)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Group By Option */}
          <div className="min-w-[120px]">
            <Select 
              value={groupByOption}
              onValueChange={(value) => setGroupByOption(value as GroupByOption)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Группировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без группировки</SelectItem>
                <SelectItem value="tags">По тегам</SelectItem>
                <SelectItem value="date">По дате</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              Сбросить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
