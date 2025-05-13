
import React from "react";
import { 
  Bell, 
  Search, 
  Menu, 
  X,
  PlusCircle,
  HelpCircle,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  pageTitle = "Дашборд"
}) => {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background">
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
      </div>
      
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            size={18} 
          />
          <input
            type="text"
            placeholder="Поиск по всему..."
            className="kira-input w-full pl-10"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
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
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-kira-purple text-white flex items-center justify-center font-medium">
            К
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
