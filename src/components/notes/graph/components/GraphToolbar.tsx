
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

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
    <Card className="w-auto shadow-md">
      <CardContent className="p-2 flex items-center gap-2">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => (
              <Button
                key={tag}
                variant="secondary"
                size="sm"
                className="h-7 px-2 py-1 text-xs"
                onClick={() => toggleTag(tag)}
              >
                {tag} <X className="ml-1 h-3 w-3" />
              </Button>
            ))}
          </div>
        )}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphToolbar;
