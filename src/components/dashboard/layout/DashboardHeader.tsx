
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Github,
  Menu,
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

interface DashboardHeaderProps {
  title?: string;
  mobileMenuToggle?: () => void;
  actions?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  mobileMenuToggle,
  actions,
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
    <header className="h-16 border-b border-border px-4 flex items-center justify-between bg-background">
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
            className="w-full pl-9 bg-background"
          />
        </div>
      </div>

      {/* Правая часть с действиями */}
      <div className="flex items-center space-x-2">
        {/* Дополнительные действия, если есть */}
        {actions && <div className="hidden md:flex">{actions}</div>}

        {/* Кнопка смены темы */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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

        {/* Кнопка уведомлений */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Уведомления</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Кнопка помощи */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Помощь</span>
        </Button>

        {/* GitHub кнопка */}
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
