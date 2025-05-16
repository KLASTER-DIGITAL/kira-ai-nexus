
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebarStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarContent } from "./SidebarContent";

export function AppSidebar() {
  const { collapsed, toggleCollapse, setCollapsed } = useSidebarStore();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  // Синхронизируем состояние мобильного меню с collapsed
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(!collapsed);
    }
  }, [collapsed, isMobile]);

  // Автоматически скрываем sidebar на мобильных устройствах при навигации
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile, setCollapsed]);
  
  // На мобильных устройствах используем Sheet
  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={(open) => {
        setMobileOpen(open);
        setCollapsed(!open);
      }}>
        <SheetContent 
          side="left" 
          className="p-0 w-[280px] border-r"
        >
          <div className="flex h-full flex-col">
            <SidebarContent 
              collapsed={collapsed}
              toggleCollapse={toggleCollapse}
              isMobile={isMobile}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // На десктопе используем фиксированный sidebar
  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 z-30 flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <SidebarContent
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
        isMobile={isMobile}
      />
    </aside>
  );
}
