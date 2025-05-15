
import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/components/dashboard/Dashboard";
import { useAuth } from '@/context/auth';

const UserDashboardPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <Layout title={`Дашборд пользователя: ${profile?.display_name || profile?.email}`}>
      <Dashboard />
    </Layout>
  );
};

export default UserDashboardPage;
