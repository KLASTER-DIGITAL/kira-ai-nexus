
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SystemInfoCard: React.FC = () => {
  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle>Системная информация</CardTitle>
        <CardDescription>
          Информация о состоянии системы и логи
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-muted/50 p-4 border">
          <h3 className="text-lg font-medium mb-2">Состояние системы</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Версия</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Последнее обновление</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Статус</span>
              <span className="text-green-500">Онлайн</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInfoCard;
