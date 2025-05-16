
import React, { useState } from "react";
import CalendarView from "@/components/calendar/CalendarView";
import CalendarIntegration from "@/components/calendar/CalendarIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layouts/PageHeader";

const CalendarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("calendar");

  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Календарь" 
        description="Управление событиями и настройка интеграций с календарем"
      />
      
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="calendar" onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="calendar">Календарь</TabsTrigger>
            <TabsTrigger value="integrations">Интеграции</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="space-y-4">
            <CalendarView />
          </TabsContent>
          <TabsContent value="integrations" className="space-y-4">
            <CalendarIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CalendarPage;
