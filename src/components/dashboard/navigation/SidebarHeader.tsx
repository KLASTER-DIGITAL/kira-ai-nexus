
import React from "react";
import { cn } from "@/lib/utils";

type SidebarHeaderProps = {
  collapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
    <div className="flex items-center h-16 px-3 border-b border-border">
      {!collapsed && (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">K</span>
          </div>
          <span className="font-bold text-lg">KIRA AI</span>
        </div>
      )}
      {collapsed && (
        <div className="h-8 w-8 mx-auto rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-semibold">K</span>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
