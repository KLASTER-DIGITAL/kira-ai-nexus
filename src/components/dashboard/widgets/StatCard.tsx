
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  className?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
  iconColor = "text-primary bg-primary/10",
}) => {
  // Определение класса для изменения (положительное зеленое, отрицательное красное)
  const changeClass = change?.startsWith("+")
    ? "text-green-600 dark:text-green-400"
    : change?.startsWith("-")
    ? "text-red-600 dark:text-red-400"
    : "text-muted-foreground";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={cn("h-8 w-8 rounded-md flex items-center justify-center", iconColor)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn("text-xs mt-1", changeClass)}>{change}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
