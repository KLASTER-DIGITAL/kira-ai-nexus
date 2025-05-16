
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Calendar,
  MessageSquare,
  Network,
  Settings,
  Users,
  LucideIcon
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  role?: "user" | "superadmin" | "all";
  badge?: string | number;
  submenu?: NavItem[];
};

export const navigationItems: NavItem[] = [
  {
    title: "Дашборд",
    href: "/dashboard/user",
    icon: LayoutDashboard,
    role: "user",
  },
  {
    title: "Заметки",
    href: "/notes",
    icon: FileText,
    role: "all",
  },
  {
    title: "Задачи",
    href: "/tasks",
    icon: CheckSquare,
    role: "all",
    badge: "5",
  },
  {
    title: "Календарь",
    href: "/calendar",
    icon: Calendar,
    role: "all",
  },
  {
    title: "Чат",
    href: "/chat",
    icon: MessageSquare,
    role: "all",
  },
  {
    title: "Граф связей",
    href: "/graph",
    icon: Network,
    role: "all",
  },
  {
    title: "Управление пользователями",
    href: "/dashboard/admin",
    icon: Users,
    role: "superadmin",
  },
  {
    title: "Настройки AI",
    href: "/ai-settings",
    icon: Settings,
    role: "superadmin",
  },
];

export default navigationItems;
