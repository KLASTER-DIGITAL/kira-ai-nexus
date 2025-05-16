
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import navigationItems, { NavItem } from "./navigationItems";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import AdminBadge from "@/components/layout/components/AdminBadge";
import { LucideIcon } from "lucide-react";

type SidebarNavProps = {
  collapsed: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const { profile } = useAuth();
  const location = useLocation();

  // Проверка активного маршрута с поддержкой вложенных путей
  const isActive = (href: string) => {
    // Точное совпадение
    if (location.pathname === href) return true;
    
    // Проверка на вложенность путей (например, /notes/123 активен для /notes)
    if (href !== '/' && location.pathname.startsWith(href + '/')) return true;
    
    return false;
  };

  // Получаем доступные элементы навигации на основе роли пользователя
  const filteredNavItems = navigationItems.filter((item) => {
    return item.role === "all" || profile?.role === item.role || (profile?.role === "superadmin" && item.role === "user");
  });

  return (
    <div className="flex-1 py-4 overflow-y-auto">
      <nav className="px-2 space-y-1">
        <TooltipProvider delayDuration={0}>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative",
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground font-medium shadow-sm"
                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <span className={cn(
                      "flex-shrink-0",
                      isActive(item.href) && "text-primary"
                    )}>
                      <Icon className="h-4 w-4" />
                    </span>
                    
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        
                        {/* Role badge for admin items */}
                        {item.role === "superadmin" && (
                          <div className="flex-shrink-0">
                            <AdminBadge />
                          </div>
                        )}
                        
                        {/* Badge for notifications or counters */}
                        {item.badge && (
                          <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Active indicator */}
                    {isActive(item.href) && !collapsed && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-primary rounded-r-full" />
                    )}
                  </Link>
                </TooltipTrigger>
                
                {collapsed && (
                  <TooltipContent side="right" className="flex items-center gap-2">
                    <span>{item.title}</span>
                    
                    {item.role === "superadmin" && <AdminBadge />}
                    
                    {item.badge && (
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </div>
  );
};

export default SidebarNav;
