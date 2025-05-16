
import React, { useState } from "react";
import { 
  SidebarProvider, 
  SidebarWrapper
} from "@/components/ui/sidebar";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AISidebar from "../ai/AISidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, actions }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <SidebarWrapper className="flex h-screen overflow-hidden">
        {/* Use the actual Sidebar component from Sidebar.tsx */}
        <div className="h-full">
          <Sidebar />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            sidebarCollapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar}
            pageTitle={title}
            actions={actions}
          />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        
        {/* AI Sidebar component */}
        <AISidebar />
      </SidebarWrapper>
    </SidebarProvider>
  );
};

export default Layout;
