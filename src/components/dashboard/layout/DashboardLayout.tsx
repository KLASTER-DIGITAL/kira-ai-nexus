
import React, { useState } from "react";
import { useAuth } from "@/context/auth";
import AppSidebar from "./AppSidebar";
import DashboardHeader from "./DashboardHeader";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  actions,
  className,
}) => {
  const { isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Обработчик мобильного меню
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Десктопный сайдбар */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Мобильный сайдбар (в Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 max-w-[280px]">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title={title}
          actions={actions}
          mobileMenuToggle={toggleMobileMenu}
        />

        <main className="flex-1 overflow-y-auto py-6 animate-fade-in">
          <div className={cn("px-4 md:px-6 max-w-7xl mx-auto", className)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
