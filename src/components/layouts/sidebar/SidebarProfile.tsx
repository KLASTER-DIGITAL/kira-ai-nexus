
import React from "react";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";

interface SidebarProfileProps {
  collapsed: boolean;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({ collapsed }) => {
  const { profile, signOut } = useAuth();

  return (
    <div className="p-3 border-t border-border">
      <div className={cn(
        "flex items-center", 
        collapsed ? "flex-col gap-2" : "gap-3"
      )}>
        <Avatar className={cn("h-10 w-10", collapsed && "mb-1")}>
          <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        
        {!collapsed && (
          <div className="flex-1">
            <p className="text-sm font-medium leading-none">
              {profile?.display_name || 'Пользователь'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {profile?.role === "superadmin" ? "Администратор" : "Пользователь"}
            </p>
            
            <div className="flex items-center gap-1 mt-2">
              <Button variant="outline" size="sm" className="w-full gap-1 h-8" onClick={() => signOut()}>
                <LogOut className="h-3.5 w-3.5" />
                <span>Выход</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Настройки</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
