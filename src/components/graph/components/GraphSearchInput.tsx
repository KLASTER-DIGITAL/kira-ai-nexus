
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GraphSearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function GraphSearchInput({ onSearch, placeholder = 'Поиск...' }: GraphSearchInputProps) {
  const [query, setQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="w-full relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        name="graph-search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-4 w-full md:w-[200px] lg:w-[300px]"
      />
    </div>
  );
}
