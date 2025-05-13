
import React from "react";
import Layout from "@/components/layout/Layout";
import CalendarView from "@/components/calendar/CalendarView";

const CalendarPage: React.FC = () => {
  return (
    <Layout title="Календарь">
      <div className="max-w-5xl mx-auto">
        <CalendarView />
      </div>
    </Layout>
  );
};

export default CalendarPage;
