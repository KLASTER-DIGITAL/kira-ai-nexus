
import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import AdminBadge from "./AdminBadge";

interface TitleSectionProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  pageTitle?: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  pageTitle = "Дашборд" 
}) => {
  const { isSuperAdmin } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-foreground"
        onClick={toggleSidebar}
      >
        {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
      </Button>
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
      {isSuperAdmin() && <AdminBadge />}
    </div>
  );
};

export default TitleSection;
