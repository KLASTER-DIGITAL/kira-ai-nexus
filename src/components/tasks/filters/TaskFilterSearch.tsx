
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface TaskFilterSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TaskFilterSearch: React.FC<TaskFilterSearchProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input 
        className="pl-9 pr-9" 
        placeholder="Поиск задач..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchQuery("")}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default TaskFilterSearch;
