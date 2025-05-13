
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import CalendarView from "@/components/calendar/CalendarView";
import CalendarIntegration from "@/components/calendar/CalendarIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CalendarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("calendar");

  return (
    <Layout title="Календарь">
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
    </Layout>
  );
};

export default CalendarPage;
