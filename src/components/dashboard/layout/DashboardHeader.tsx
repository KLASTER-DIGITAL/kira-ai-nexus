
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Menu,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title?: string;
  mobileMenuToggle?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  mobileMenuToggle,
  actions,
  className,
}) => {
  const { setTheme, theme } = useTheme();
  const location = useLocation();

  // Функция для получения названия текущей страницы
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.startsWith('/dashboard/admin')) return 'Панель администратора';
    if (path.startsWith('/dashboard/user')) return 'Панель пользователя';
    if (path.startsWith('/notes')) return 'Заметки';
    if (path.startsWith('/tasks')) return 'Задачи';
    if (path.startsWith('/calendar')) return 'Календарь';
    if (path.startsWith('/chat')) return 'Чат';
    if (path.startsWith('/graph')) return 'Граф связей';
    if (path.startsWith('/ai-settings')) return 'Настройки AI';
    
    return title || 'KIRA AI';
  };

  return (
    <header className={cn(
      "h-16 border-b border-border/60 px-4 flex items-center justify-between bg-background",
      "shadow-sm backdrop-blur-sm bg-background/80 sticky top-0 z-10",
      className
    )}>
      {/* Левая часть с заголовком и кнопкой мобильного меню */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={mobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Меню</span>
        </Button>
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      {/* Центральная часть с поиском */}
      <div className="hidden md:flex max-w-md w-full mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            className="w-full pl-9 bg-background/70 hover:bg-background focus:bg-background"
          />
        </div>
      </div>

      {/* Правая часть с действиями */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Дополнительные действия, если есть */}
        {actions && <div className="hidden md:flex">{actions}</div>}
        
        {/* Кнопка создания */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Новая заметка</DropdownMenuItem>
              <DropdownMenuItem>Новая задача</DropdownMenuItem>
              <DropdownMenuItem>Новое событие</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Кнопка смены темы */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex md:hidden">
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Сменить тему</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Светлая</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Тёмная</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Системная</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Кнопка темы для десктопа */}
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden md:flex"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Кнопка уведомлений */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Уведомления</span>
          <Badge className="absolute top-1 right-1.5 h-2 w-2 p-0 bg-red-500" />
        </Button>

        {/* Кнопка помощи */}
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Помощь</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
