
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebarStore } from "@/store/sidebarStore";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

// Lucide icons
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Network,
  Settings, 
  Users, 
  ChevronLeft,
  ChevronRight,
  PanelRight,
  LogOut
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NavSection from "./NavSection";
import NavItem from "./NavItem";
import UserProfile from "./UserProfile";

const Sidebar = () => {
  const { collapsed, toggleCollapse } = useSidebarStore();
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const isSuperAdmin = profile?.role === "superadmin";

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 h-full bg-background border-r border-border z-40 transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-border",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-kira-purple flex items-center justify-center">
              <span className="text-white font-semibold">K</span>
            </div>
            <span className="font-bold text-lg">KIRA AI</span>
          </Link>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-md bg-kira-purple flex items-center justify-center">
            <span className="text-white font-semibold">K</span>
          </div>
        )}
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={toggleCollapse}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <NavSection title={collapsed ? "" : "General"}>
          <NavItem 
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Dashboard" 
            href="/dashboard/user"
            isActive={location.pathname === "/dashboard/user"}
            collapsed={collapsed}
          />
          <NavItem 
            icon={<FileText className="h-5 w-5" />}
            title="Notes" 
            href="/notes"
            isActive={location.pathname.startsWith("/notes")}
            collapsed={collapsed}
          />
          <NavItem 
            icon={<CheckSquare className="h-5 w-5" />}
            title="Tasks" 
            href="/tasks"
            isActive={location.pathname.startsWith("/tasks")}
            collapsed={collapsed}
            badge="5"
          />
        </NavSection>

        <NavSection title={collapsed ? "" : "Apps"}>
          <NavItem 
            icon={<Calendar className="h-5 w-5" />}
            title="Calendar" 
            href="/calendar"
            isActive={location.pathname.startsWith("/calendar")}
            collapsed={collapsed}
          />
          <NavItem 
            icon={<MessageSquare className="h-5 w-5" />}
            title="Chat" 
            href="/chat"
            isActive={location.pathname.startsWith("/chat")}
            collapsed={collapsed}
          />
          <NavItem 
            icon={<Network className="h-5 w-5" />}
            title="Graph" 
            href="/graph"
            isActive={location.pathname.startsWith("/graph")}
            collapsed={collapsed}
          />
        </NavSection>

        {isSuperAdmin && (
          <NavSection title={collapsed ? "" : "Admin"}>
            <NavItem 
              icon={<Users className="h-5 w-5" />}
              title="User Management" 
              href="/dashboard/admin"
              isActive={location.pathname === "/dashboard/admin"}
              collapsed={collapsed}
              admin
            />
            <NavItem 
              icon={<Settings className="h-5 w-5" />}
              title="AI Settings" 
              href="/ai-settings"
              isActive={location.pathname.startsWith("/ai-settings")}
              collapsed={collapsed}
              admin
            />
          </NavSection>
        )}
      </div>

      {/* Collapse toggle for collapsed state */}
      {collapsed && (
        <div className="mt-auto mb-2 flex justify-center">
          <Button variant="ghost" size="icon" onClick={toggleCollapse}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Footer with user profile */}
      <div className="border-t border-border p-3">
        <UserProfile collapsed={collapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
