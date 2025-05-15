
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface GraphSearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const GraphSearchInput: React.FC<GraphSearchInputProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Поиск узлов..."
        className="pl-8 pr-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default GraphSearchInput;
