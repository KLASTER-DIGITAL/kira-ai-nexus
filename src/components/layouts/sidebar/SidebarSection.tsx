
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

export function SidebarSection({ title, children, isCollapsed }: SidebarSectionProps) {
  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {children}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h3 className="px-3 text-xs font-medium text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
