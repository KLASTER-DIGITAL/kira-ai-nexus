
import React from "react";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  return (
    <div className="relative">
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        size={18} 
      />
      <input
        type="text"
        placeholder="Поиск по всему..."
        className="kira-input w-full pl-10"
      />
    </div>
  );
};

export default SearchBar;
