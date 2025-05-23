
import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePageHeader } from "@/context/page-header";

export function PageTitle() {
  const location = useLocation();
  const { title } = usePageHeader();
  
  // Функция для получения заголовка текущей страницы
  const getPageTitle = () => {
    // Если заголовок задан через контекст, используем его
    if (title) return title;
    
    // Иначе определяем заголовок на основе маршрута
    const path = location.pathname;
    
    if (path.startsWith('/dashboard/admin')) return 'Панель администратора';
    if (path.startsWith('/dashboard/user')) return 'Панель пользователя';
    if (path.startsWith('/notes')) return 'Заметки';
    if (path.startsWith('/tasks')) return 'Задачи';
    if (path.startsWith('/calendar')) return 'Календарь';
    if (path.startsWith('/chat')) return 'Чат';
    if (path.startsWith('/graph')) return 'Граф связей';
    if (path.startsWith('/notes-graph')) return 'Граф заметок';
    if (path.startsWith('/ai-settings')) return 'Настройки AI';
    if (path.startsWith('/activity')) return 'Активность';
    if (path.startsWith('/notifications')) return 'Уведомления';
    if (path.startsWith('/settings')) return 'Настройки';
    
    return 'KIRA AI';
  };
  
  const getBreadcrumbPath = () => {
    const path = location.pathname.split('/').filter(Boolean);
    
    if (path.length <= 1) return null;
    
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <span className="hidden md:inline">KIRA AI</span>
        <span className="mx-2 hidden md:inline">/</span>
        <span>{getPageTitle()}</span>
      </div>
    );
  };
  
  return (
    <div>
      {getBreadcrumbPath()}
      <h1 className="text-xl font-semibold tracking-tight">
        {getPageTitle()}
      </h1>
    </div>
  );
}
