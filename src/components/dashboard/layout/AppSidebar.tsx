
import { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "../navigation/SidebarHeader";
import SidebarNav from "../navigation/SidebarNav";
import SidebarFooter from "../navigation/SidebarFooter";

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r border-border transition-width duration-300 ease-in-out",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Sidebar Header with Logo */}
      <SidebarHeader collapsed={collapsed} />

      {/* Navigation Links */}
      <SidebarNav collapsed={collapsed} />

      {/* User Profile Section */}
      <SidebarFooter collapsed={collapsed} setCollapsed={setCollapsed} />
    </div>
  );
};

export default AppSidebar;
