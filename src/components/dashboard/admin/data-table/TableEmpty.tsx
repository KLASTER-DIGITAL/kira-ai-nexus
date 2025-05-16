
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FileSearch } from "lucide-react";

interface TableEmptyProps {
  colSpan: number;
  message?: string;
  icon?: React.ReactNode;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  colSpan,
  message = "Нет данных для отображения",
  icon = <FileSearch className="h-10 w-10 mx-auto text-muted-foreground" />,
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-10">
        {icon}
        <p className="mt-2 text-muted-foreground">{message}</p>
      </TableCell>
    </TableRow>
  );
};
