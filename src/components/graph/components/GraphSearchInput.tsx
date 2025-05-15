
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface GraphSearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const GraphSearchInput: React.FC<GraphSearchInputProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Поиск по заголовку или контенту..."
        className="pl-8"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default GraphSearchInput;
