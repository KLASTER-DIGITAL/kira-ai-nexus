
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterOption<T extends string | number> {
  value: T;
  label: string;
}

interface FilterableSelectProps<T extends string | number> {
  value: T | null;
  onChange: (value: T | null) => void;
  options: FilterOption<T>[];
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  className?: string;
}

export function FilterableSelect<T extends string | number>({
  value,
  onChange,
  options,
  placeholder = "Выберите...",
  label,
  clearable = true,
  className,
}: FilterableSelectProps<T>) {
  const selectedOption = options.find(option => option.value === value);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className={className}>
      {label && <div className="text-sm font-medium mb-1.5">{label}</div>}
      
      {value && clearable ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-2 py-1.5">
            {selectedOption?.label || value.toString()}
            <X 
              className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={handleClear}
            />
          </Badge>
        </div>
      ) : (
        <Select
          value={value?.toString() || ""}
          onValueChange={(val) => {
            if (val === "") return onChange(null);
            onChange(val as unknown as T);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {clearable && (
              <SelectItem value="">
                <span className="text-muted-foreground">Очистить</span>
              </SelectItem>
            )}
            {options.map((option) => (
              <SelectItem key={option.value.toString()} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
