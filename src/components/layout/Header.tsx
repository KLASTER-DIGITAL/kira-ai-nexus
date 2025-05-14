
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Search, 
  Menu, 
  X,
  PlusCircle,
  HelpCircle,
  LogOut,
  Settings,
  User,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  pageTitle?: string;
  actions?: React.ReactNode; // Add this line to accept actions
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  pageTitle = "Дашборд",
  actions     // Add this parameter
}) => {
  const navigate = useNavigate();
  const { user, profile, isSuperAdmin, signOut } = useAuth();

  const getProfileInitials = (): string => {
    if (profile?.display_name) {
      return profile.display_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    
    return "K";
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Navigate to appropriate dashboard based on role
  const navigateToDashboard = () => {
    if (isSuperAdmin()) {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/user');
    }
  };

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
        {isSuperAdmin() && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300 flex items-center">
            <Shield size={12} className="mr-1" />
            Админ
          </span>
        )}
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
        {/* Add the actions before the bell icon */}
        {actions}
        
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-kira-purple text-white">
                  {getProfileInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
              {profile?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={navigateToDashboard}>
                <User className="mr-2 h-4 w-4" />
                <span>Дашборд</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки профиля</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
