
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  isMobile: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  collapsed, 
  toggleCollapse,
  isMobile 
}) => {
  return (
    <div className={cn(
      "flex h-16 items-center border-b border-border px-4",
      collapsed ? "justify-center" : "justify-between"
    )}>
      {!collapsed ? (
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">K</span>
          </div>
          <span className="font-bold text-lg">KIRA AI</span>
        </Link>
      ) : (
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-semibold">K</span>
        </div>
      )}
      
      {!collapsed && (
        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
          <ChevronsLeft className="h-5 w-5" />
          <span className="sr-only">Свернуть меню</span>
        </Button>
      )}
      
      {/* Кнопка разворачивания меню (когда меню свернуто) */}
      {collapsed && !isMobile && (
        <div className="mt-4">
          <TooltipProvider delayDuration={0}>
            <Button variant="ghost" size="icon" onClick={toggleCollapse}>
              <ChevronsRight className="h-5 w-5" />
              <span className="sr-only">Развернуть меню</span>
            </Button>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};
