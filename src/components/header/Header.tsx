
import React from "react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useLocation } from "react-router-dom";
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Settings,
  PlusCircle
} from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import UserActions from "./UserActions";
import NotificationMenu from "./NotificationMenu";

const Header = () => {
  const { collapsed, toggleCollapse } = useSidebarStore();
  const location = useLocation();

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.startsWith('/dashboard/admin')) return 'Admin Dashboard';
    if (path.startsWith('/dashboard/user')) return 'User Dashboard';
    if (path.startsWith('/notes')) return 'Notes';
    if (path.startsWith('/tasks')) return 'Tasks';
    if (path.startsWith('/calendar')) return 'Calendar';
    if (path.startsWith('/chat')) return 'Chat';
    if (path.startsWith('/graph')) return 'Graph View';
    if (path.startsWith('/ai-settings')) return 'AI Settings';
    
    return 'Dashboard';
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Left section */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={toggleCollapse}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      {/* Center section - Search */}
      <div className="hidden md:flex max-w-md w-full mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-full pl-9 bg-background/70 hover:bg-background focus:bg-background"
          />
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Create button for mobile */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New Note</DropdownMenuItem>
              <DropdownMenuItem>New Task</DropdownMenuItem>
              <DropdownMenuItem>New Event</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Notifications */}
        <NotificationMenu />
        
        {/* Theme toggle */}
        <ModeToggle />
        
        {/* User menu */}
        <UserActions />
      </div>
    </header>
  );
};

export default Header;
