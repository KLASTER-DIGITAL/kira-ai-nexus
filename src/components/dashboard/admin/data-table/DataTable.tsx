
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { SearchInput } from "./SearchInput";
import { TablePagination } from "./TablePagination";
import { TableLoading } from "./TableLoading";
import { TableEmpty } from "./TableEmpty";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  searchable?: boolean;
  searchKey?: string;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  searchFunction?: (items: T[], query: string) => T[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  searchable = false,
  searchKey = "name",
  searchPlaceholder = "Поиск...",
  pagination = false,
  pageSize = 10,
  searchFunction,
  emptyMessage = "Нет данных для отображения",
  emptyIcon,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Default search function if not provided
  const defaultSearchFunction = (items: T[], query: string) => {
    return items.filter((item) => {
      if (!searchKey) return true;
      const value = item[searchKey];
      if (typeof value === "string") {
        return value.toLowerCase().includes(query.toLowerCase());
      }
      return false;
    });
  };

  // Filter data based on search query
  const filteredData = searchQuery
    ? (searchFunction || defaultSearchFunction)(data, searchQuery)
    : data;

  // Calculate pagination
  const totalPages = pagination ? Math.ceil(filteredData.length / pageSize) : 1;
  const startIndex = pagination ? (currentPage - 1) * pageSize : 0;
  const endIndex = pagination ? startIndex + pageSize : filteredData.length;
  const paginatedData = pagination
    ? filteredData.slice(startIndex, endIndex)
    : filteredData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={searchPlaceholder}
        />
      )}
      
      <div className={cn("rounded-md border", className)}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {isLoading ? (
              <TableLoading colSpan={columns.length} />
            ) : paginatedData.length === 0 ? (
              <TableEmpty 
                colSpan={columns.length} 
                message={emptyMessage} 
                icon={emptyIcon} 
              />
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column.key}`} className={column.className}>
                      {column.cell(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {pagination && filteredData.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
