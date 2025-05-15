
import React, { useState } from "react";
import { 
  Sidebar, 
  SidebarProvider 
} from "@/components/ui/sidebar";
import Header from "./Header";
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
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          {/* Sidebar content can go here */}
        </Sidebar>
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
      </div>
    </SidebarProvider>
  );
};

export default Layout;
