
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend = "up",
  className,
  iconClassName,
  valueClassName,
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md", 
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn(
          "h-8 w-8 rounded-md flex items-center justify-center",
          iconClassName || "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>
          {value}
        </div>
        {change && (
          <p className={cn(
            "text-xs mt-1",
            trend === "up" ? "text-green-500" : 
            trend === "down" ? "text-red-500" : 
            "text-muted-foreground"
          )}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
