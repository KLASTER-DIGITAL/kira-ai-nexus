
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OverviewCardProps {
  title: string;
  description?: string;
  tabs: {
    value: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
  className?: string;
  actions?: React.ReactNode;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  description,
  tabs,
  defaultTab,
  className,
  actions,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue={defaultTab || tabs[0].value}>
          <TabsList className="grid w-full grid-cols-3 border-b rounded-none h-10">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="p-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
