
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AISidebar from "../ai/AISidebar";
import { cn } from "@/lib/utils";
import { ANIMATIONS } from "@/lib/animations";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header pageTitle={title} />
          
          <main className={cn("flex-1 overflow-y-auto p-6", ANIMATIONS.fadeIn)}>
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
