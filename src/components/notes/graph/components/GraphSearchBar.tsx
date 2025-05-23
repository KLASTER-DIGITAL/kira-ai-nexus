
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GraphSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const GraphSearchBar: React.FC<GraphSearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex-1 min-w-[200px]">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск заметок в графе..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default GraphSearchBar;
