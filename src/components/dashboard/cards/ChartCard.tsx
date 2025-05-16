
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ChartPeriod = "1d" | "1w" | "1m" | "1y";

interface ChartCardProps {
  title: string;
  description?: string;
  data: any[];
  periods?: {
    value: ChartPeriod;
    label: string;
  }[];
  defaultPeriod?: ChartPeriod;
  valueKey?: string;
  type?: "line" | "area";
  color?: string;
  height?: number;
  className?: string;
  renderValue?: (value: any) => React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  data,
  periods = [
    { value: "1d", label: "1D" },
    { value: "1w", label: "1W" },
    { value: "1m", label: "1M" },
    { value: "1y", label: "1Y" },
  ],
  defaultPeriod = "1w",
  valueKey = "value",
  type = "line",
  color = "hsl(var(--primary))",
  height = 200,
  className,
  renderValue,
}) => {
  const [period, setPeriod] = React.useState<ChartPeriod>(defaultPeriod);

  // In a real app, you would fetch data based on the selected period
  // For now, we'll just use the same data for all periods
  const chartData = data;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Tabs defaultValue={defaultPeriod} onValueChange={(value) => setPeriod(value as ChartPeriod)}>
          <TabsList className="grid grid-cols-4 h-7">
            {periods.map((p) => (
              <TabsTrigger key={p.value} value={p.value} className="text-xs">
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={(value: any) => [renderValue ? renderValue(value) : value, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={valueKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={(value: any) => [renderValue ? renderValue(value) : value, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={valueKey}
                  stroke={color}
                  strokeWidth={2}
                  fill={`${color}33`}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
