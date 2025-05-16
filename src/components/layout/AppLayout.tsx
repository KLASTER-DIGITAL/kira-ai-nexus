
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";

const AppLayout = () => {
  const { collapsed } = useSidebarStore();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div 
        className={cn(
          "flex flex-col flex-1 w-full transition-all duration-300 ease-in-out",
          collapsed ? "pl-16" : "pl-64"
        )}
      >
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
