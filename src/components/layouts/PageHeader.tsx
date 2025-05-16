
import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RoleBadge } from "./header/RoleBadge";

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  showRoleBadge?: boolean;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  showRoleBadge = false,
}: PageHeaderProps) {
  const location = useLocation();

  // Get dynamic title based on current route if not provided
  const getPageTitle = () => {
    if (title) return title;

    const path = location.pathname;
    
    if (path.startsWith('/dashboard/admin')) return 'Панель администратора';
    if (path.startsWith('/dashboard/user')) return 'Панель пользователя';
    if (path.startsWith('/notes')) return 'Заметки';
    if (path.startsWith('/tasks')) return 'Задачи';
    if (path.startsWith('/calendar')) return 'Календарь';
    if (path.startsWith('/chat')) return 'Чат';
    if (path.startsWith('/graph')) return 'Граф связей';
    if (path.startsWith('/ai-settings')) return 'Настройки AI';
    if (path.startsWith('/activity')) return 'Активность';
    if (path.startsWith('/notifications')) return 'Уведомления';
    if (path.startsWith('/settings')) return 'Настройки';
    
    return 'KIRA AI';
  };

  return (
    <div className={cn("flex flex-col space-y-1.5 pb-6", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center">
          {getPageTitle()}
          {showRoleBadge && <RoleBadge />}
        </h1>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
