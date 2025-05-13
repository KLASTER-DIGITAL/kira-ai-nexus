
import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/components/dashboard/Dashboard";
import { Metadata } from "@/components/ui/metadata";

const DashboardPage: React.FC = () => {
  return (
    <Layout title="Дашборд">
      <Dashboard />
    </Layout>
  );
};

export default DashboardPage;
