
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { NavigationItem } from "./navigation-config";

interface SidebarItemProps {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
}

export function SidebarItem({ item, isActive, isCollapsed }: SidebarItemProps) {
  const { icon: Icon, href, title, badge, role } = item;
  
  const content = (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-accent text-accent-foreground font-medium" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        isCollapsed && "justify-center px-0"
      )}
    >
      <div className={cn("flex-shrink-0", isActive && "text-primary")}>
        <Icon className="h-5 w-5" />
      </div>
      
      {!isCollapsed && (
        <>
          <span className="flex-1">{title}</span>
          
          {/* Бейдж для количества */}
          {badge && (
            <Badge variant="secondary" className="h-5 rounded-full px-2 font-normal">
              {badge}
            </Badge>
          )}
          
          {/* Индикатор admin элемента */}
          {role === "superadmin" && (
            <Badge variant="outline" className="h-5 rounded-full px-1.5 text-xs font-normal">
              ADMIN
            </Badge>
          )}
        </>
      )}
    </Link>
  );
  
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="flex items-center gap-2">
              <span>{title}</span>
              {badge && <Badge variant="secondary">{badge}</Badge>}
              {role === "superadmin" && (
                <Badge variant="outline" className="text-xs">ADMIN</Badge>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return content;
}
