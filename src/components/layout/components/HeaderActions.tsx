
import React from "react";
import { Bell, HelpCircle, PlusCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useDashboardStore } from "@/store/dashboardStore";

interface HeaderActionsProps {
  additionalActions?: React.ReactNode;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ additionalActions }) => {
  const location = useLocation();
  const { setConfigDialogOpen } = useDashboardStore();
  
  // Show dashboard settings button only on dashboard pages
  const isDashboardPage = location.pathname.includes('/dashboard');
  
  // Handle opening dashboard settings
  const handleOpenDashboardSettings = () => {
    setConfigDialogOpen(true);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Dashboard settings button */}
      {isDashboardPage && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleOpenDashboardSettings}
          className="relative"
          title="Настроить дашборд"
        >
          <LayoutGrid size={20} />
        </Button>
      )}
      
      {/* Add existing actions */}
      {additionalActions}
      
      <Button variant="ghost" size="icon" className="relative">
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-kira-purple rounded-full"></span>
      </Button>
      
      <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
        <PlusCircle size={16} />
        <span>Создать</span>
      </Button>
      
      <Button variant="ghost" size="icon">
        <HelpCircle size={20} />
      </Button>
    </div>
  );
};

export default HeaderActions;
