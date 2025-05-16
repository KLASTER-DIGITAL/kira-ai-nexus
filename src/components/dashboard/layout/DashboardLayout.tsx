
import React from "react";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";
import Header from "@/components/header/Header";

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
      <Header 
        sidebarCollapsed={collapsed} 
        toggleSidebar={() => useSidebarStore.getState().toggleCollapse()}
        pageTitle={title}
        actions={actions}
      />
      
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
