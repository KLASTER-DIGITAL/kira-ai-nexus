
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import navigationItems from "./navigationItems";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

type SidebarNavProps = {
  collapsed: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const { profile } = useAuth();
  const location = useLocation();

  // Проверка активного маршрута
  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

  // Получаем доступные элементы навигации на основе роли пользователя
  const filteredNavItems = navigationItems.filter((item) => {
    return item.role === "all" || profile?.role === item.role || (profile?.role === "superadmin" && item.role === "user");
  });

  return (
    <div className="flex-1 py-4 overflow-y-auto">
      <nav className="px-2 space-y-1">
        <TooltipProvider delayDuration={0}>
          {filteredNavItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="flex-1">{item.title}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="flex items-center gap-1">
                  {item.title}
                  {item.badge && (
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </div>
  );
};

export default SidebarNav;
