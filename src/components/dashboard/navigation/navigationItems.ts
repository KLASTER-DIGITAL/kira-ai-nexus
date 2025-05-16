
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Calendar,
  MessageSquare,
  Network,
  Settings,
  Users,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  role?: "user" | "superadmin" | "all";
  badge?: string | number;
  submenu?: NavItem[];
};

export const navigationItems: NavItem[] = [
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

export default navigationItems;
