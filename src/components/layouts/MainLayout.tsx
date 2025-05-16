
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

// Компоненты нового UI
import { AppSidebar } from "@/components/layouts/sidebar/AppSidebar";
import { AppHeader } from "@/components/layouts/header/AppHeader";

export function MainLayout() {
  const { profile, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  // Используем эффект для предотвращения мерцания при гидратации
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}
