
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphSearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const GraphSearchInput: React.FC<GraphSearchInputProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Поиск в графе..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 pr-8 h-9"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          onClick={() => setSearchTerm("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default GraphSearchInput;
