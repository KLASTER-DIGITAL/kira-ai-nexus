
import React from "react";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SidebarFooterProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, setCollapsed }) => {
  const { profile, signOut } = useAuth();

  // Обработчик выхода из системы
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="p-3 border-t border-border">
      <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-kira-purple text-white">
                {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{profile?.display_name || profile?.email || "Пользователь"}</p>
              <p className="text-xs text-muted-foreground">{profile?.role === "superadmin" ? "Администратор" : "Пользователь"}</p>
            </div>
          </div>
        )}
        
        {collapsed && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-kira-purple text-white">
              {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Дополнительные кнопки и действия */}
      <div className={cn("mt-3 flex", collapsed ? "justify-center" : "justify-between")}>
        <TooltipProvider delayDuration={0}>
          {!collapsed ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut} 
                className="flex-1 mr-1"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выход
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Свернуть</span>
              </Button>
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setCollapsed(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Развернуть</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Развернуть меню</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SidebarFooter;
