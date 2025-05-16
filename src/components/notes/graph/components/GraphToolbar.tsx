
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import GraphSearchBar from './GraphSearchBar';

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
    <div className="flex items-center justify-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-md shadow-sm">
      {hasFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs"
        >
          <RotateCcw className="h-3 w-3" />
          Сбросить фильтры
        </Button>
      )}
    </div>
  );
};

export default GraphToolbar;
