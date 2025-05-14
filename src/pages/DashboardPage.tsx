
import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/components/dashboard/Dashboard";
import { Metadata } from "@/components/ui/metadata";

const DashboardPage: React.FC = () => {
  return (
    <Layout title="Дашборд">
      <Metadata 
        title="KIRA AI | Дашборд" 
        description="Интеллектуальный помощник для управления задачами и информацией"
      />
      <Dashboard />
    </Layout>
  );
};

export default DashboardPage;
