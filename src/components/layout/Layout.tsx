
import React from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, actions }) => {
  return (
    <DashboardLayout title={title} actions={actions}>
      {children}
    </DashboardLayout>
  );
};

export default Layout;
