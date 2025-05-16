
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

interface TableLoadingProps {
  colSpan: number;
  message?: string;
}

export const TableLoading: React.FC<TableLoadingProps> = ({
  colSpan,
  message = "Загрузка данных...",
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-10">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </TableCell>
    </TableRow>
  );
};
