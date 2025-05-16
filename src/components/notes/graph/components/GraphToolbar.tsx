
import React from "react";
import { Button } from "@/components/ui/button";

interface GraphToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  showIsolatedNodes: boolean;
  setShowIsolatedNodes: (value: boolean) => void;
}

const GraphToolbar: React.FC<GraphToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTags,
  toggleTag,
  allTags,
  showIsolatedNodes,
  setShowIsolatedNodes,
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setSearchTerm('')}
        disabled={!searchTerm}
      >
        Очистить поиск
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => {
          const tags = [...selectedTags];
          tags.forEach(tag => toggleTag(tag));
          setSearchTerm('');
        }}
        disabled={selectedTags.length === 0 && !searchTerm}
      >
        Сбросить фильтры
      </Button>
    </div>
  );
};

export default GraphToolbar;
