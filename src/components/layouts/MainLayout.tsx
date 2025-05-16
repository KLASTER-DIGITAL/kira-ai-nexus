
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PageHeaderProvider } from "@/context/page-header";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebarStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Компоненты нового UI
import { AppSidebar } from "@/components/layouts/sidebar/AppSidebar";
import { AppHeader } from "@/components/layouts/header/AppHeader";

export function MainLayout() {
  const { profile, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebarStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Устанавливаем collapsed = true на мобильных устройствах при монтировании
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile, setCollapsed]);

  // Используем эффект для предотвращения мерцания при гидратации
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PageHeaderProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <main 
            className={cn(
              "flex-1 flex flex-col transition-all duration-300 ease-in-out w-full",
              collapsed ? "md:pl-[80px]" : "md:pl-[280px]"
            )}
          >
            <AppHeader />
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <Outlet />
            </div>
          </main>
          <Toaster position="top-right" richColors />
        </div>
      </PageHeaderProvider>
    </ThemeProvider>
  );
}
