
import React from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard,
  MessageCircle, 
  CheckSquare, 
  FileText, 
  Calendar,
  Settings,
  User
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Дашборд", path: "/dashboard" },
  { icon: MessageCircle, label: "Чат", path: "/chat" },
  { icon: CheckSquare, label: "Задачи", path: "/tasks" },
  { icon: FileText, label: "Заметки", path: "/notes" },
  { icon: Calendar, label: "Календарь", path: "/calendar" },
];

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  return (
    <div
      className={`
        h-screen bg-sidebar flex flex-col text-sidebar-foreground
        ${collapsed ? "w-[70px]" : "w-[240px]"}
        transition-all duration-300 border-r border-sidebar-border
      `}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-kira-purple w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-sidebar-foreground">KIRA AI</span>
          )}
        </Link>
      </div>

      <div className="mt-6 px-2 flex-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-md mb-1
              text-sidebar-foreground hover:bg-sidebar-accent transition-colors
            `}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="mt-auto px-2 mb-4">
        <Link
          to="/settings"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-md mb-1
            text-sidebar-foreground hover:bg-sidebar-accent transition-colors
          `}
        >
          <Settings size={20} />
          {!collapsed && <span>Настройки</span>}
        </Link>
        <Link
          to="/profile"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-md
            text-sidebar-foreground hover:bg-sidebar-accent transition-colors
          `}
        >
          <User size={20} />
          {!collapsed && <span>Профиль</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
