
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User, Shield } from "lucide-react";
import { useAuth } from '@/context/auth';
import { toast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";

const UserMenu: React.FC = () => {
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
  );
};

export default UserMenu;
