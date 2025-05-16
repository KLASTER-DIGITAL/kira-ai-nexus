
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Calendar,
  MessageSquare,
  Network,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  role?: "user" | "superadmin" | "all";
  badge?: string | number;
  submenu?: NavItem[];
};

const navigationItems: NavItem[] = [
  {
    title: "Дашборд",
    href: "/dashboard/user",
    icon: <LayoutDashboard className="h-4 w-4" />,
    role: "user",
  },
  {
    title: "Заметки",
    href: "/notes",
    icon: <FileText className="h-4 w-4" />,
    role: "all",
  },
  {
    title: "Задачи",
    href: "/tasks",
    icon: <CheckSquare className="h-4 w-4" />,
    role: "all",
    badge: "5",
  },
  {
    title: "Календарь",
    href: "/calendar",
    icon: <Calendar className="h-4 w-4" />,
    role: "all",
  },
  {
    title: "Чат",
    href: "/chat",
    icon: <MessageSquare className="h-4 w-4" />,
    role: "all",
  },
  {
    title: "Граф связей",
    href: "/graph",
    icon: <Network className="h-4 w-4" />,
    role: "all",
  },
  {
    title: "Управление пользователями",
    href: "/dashboard/admin",
    icon: <Users className="h-4 w-4" />,
    role: "superadmin",
  },
  {
    title: "Настройки AI",
    href: "/ai-settings",
    icon: <Settings className="h-4 w-4" />,
    role: "superadmin",
  },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, signOut } = useAuth();
  const location = useLocation();

  // Проверка активного маршрута
  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");
  
  // Получаем доступные элементы навигации на основе роли пользователя
  const filteredNavItems = navigationItems.filter((item) => {
    return item.role === "all" || profile?.role === item.role || (profile?.role === "superadmin" && item.role === "user");
  });

  // Обработчик выхода из системы
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r border-border transition-width duration-300 ease-in-out",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Sidebar Header with Logo */}
      <div className="flex items-center h-16 px-3 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-kira-purple flex items-center justify-center">
              <span className="text-white font-semibold">K</span>
            </div>
            <span className="font-bold text-lg">KIRA AI</span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 mx-auto rounded-md bg-kira-purple flex items-center justify-center">
            <span className="text-white font-semibold">K</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          <TooltipProvider delayDuration={0}>
            {filteredNavItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="flex-1">{item.title}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="flex items-center gap-1">
                    {item.title}
                    {item.badge && (
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>

      {/* User Profile Section */}
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
    </div>
  );
};

export default AppSidebar;
