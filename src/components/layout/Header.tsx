
import React from "react";
import TitleSection from "./components/TitleSection";
import SearchBar from "./components/SearchBar";
import HeaderActions from "./components/HeaderActions";
import UserMenu from "./components/UserMenu";

interface HeaderProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  pageTitle?: string;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  pageTitle = "Дашборд",
  actions     
}) => {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background">
      <TitleSection 
        sidebarCollapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
        pageTitle={pageTitle} 
      />
      
      <div className="flex-1 max-w-xl mx-4">
        <SearchBar />
      </div>
      
      <div className="flex items-center gap-2">
        <HeaderActions additionalActions={actions} />
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
