
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="opacity-70">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change) && (
          <div className="flex items-center pt-1">
            {change && (
              <Badge 
                variant={change.isPositive ? "default" : "destructive"}
                className={cn(
                  "mr-2 text-xs",
                  change.isPositive ? "bg-green-100 text-green-600 hover:bg-green-100 hover:text-green-600" : "bg-red-100 text-red-600 hover:bg-red-100 hover:text-red-600"
                )}
              >
                <span className="flex items-center gap-0.5">
                  {change.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {change.value}%
                </span>
              </Badge>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
