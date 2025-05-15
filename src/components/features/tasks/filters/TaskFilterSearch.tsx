
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TaskFilterSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TaskFilterSearch: React.FC<TaskFilterSearchProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Поиск задач..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default TaskFilterSearch;
