
import React from "react";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";
import DashboardHeader from "@/components/dashboard/layout/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Дашборд",
  actions 
}) => {
  const { collapsed } = useSidebarStore();

  return (
    <div className="flex-1 flex flex-col w-full">
      <DashboardHeader
        title={title}
        mobileMenuToggle={() => useSidebarStore.getState().toggleCollapse()}
        actions={actions}
      />
      
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
