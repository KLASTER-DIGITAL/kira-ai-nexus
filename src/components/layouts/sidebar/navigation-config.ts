
import { LucideIcon, LayoutDashboard, FileText, CheckSquare, Calendar, MessageSquare, Network, Settings, Users, Bell, BookOpen, Warehouse, BarChart3 } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  role?: "user" | "superadmin" | "all";
  badge?: string | number | null;
  badgeQueryKey?: string; // Ключ для динамического обновления счетчика
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const navigationConfig: NavigationSection[] = [
  {
    title: "Обзор",
    items: [
      {
        title: "Дашборд",
        href: "/dashboard/user",
        icon: LayoutDashboard,
        role: "user"
      },
      {
        title: "Активность",
        href: "/activity",
        icon: BarChart3,
        role: "all"
      },
      {
        title: "Настройки уведомлений",
        href: "/notifications",
        icon: Bell,
        role: "all",
        badge: null,
        badgeQueryKey: 'notifications-count'
      }
    ]
  },
  {
    title: "Приложения",
    items: [
      {
        title: "Заметки",
        href: "/notes",
        icon: FileText,
        role: "all"
      },
      {
        title: "Задачи",
        href: "/tasks",
        icon: CheckSquare,
        role: "all",
        badge: null,
        badgeQueryKey: 'tasks-count'
      },
      {
        title: "Календарь",
        href: "/calendar",
        icon: Calendar,
        role: "all"
      },
      {
        title: "Чат",
        href: "/chat",
        icon: MessageSquare,
        role: "all"
      },
      {
        title: "Граф связей",
        href: "/graph",
        icon: Network,
        role: "all"
      }
    ]
  },
  {
    title: "Администрирование",
    items: [
      {
        title: "Управление пользователями",
        href: "/dashboard/admin",
        icon: Users,
        role: "superadmin"
      },
      {
        title: "Настройки AI",
        href: "/ai-settings",
        icon: Settings,
        role: "superadmin"
      }
    ]
  }
];
