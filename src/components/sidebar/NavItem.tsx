
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive?: boolean;
  collapsed?: boolean;
  badge?: string | number;
  admin?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  title,
  href,
  isActive,
  collapsed,
  badge,
  admin,
}) => {
  const content = (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      <span className={cn("flex-shrink-0", isActive && "text-primary")}>
        {icon}
      </span>

      {!collapsed && (
        <>
          <span className="flex-1">{title}</span>

          {/* Badge */}
          {badge && (
            <Badge variant="secondary" className="h-5 min-w-5 px-1 flex items-center justify-center">
              {badge}
            </Badge>
          )}

          {/* Admin indicator */}
          {admin && (
            <Badge variant="primary" className="h-5 px-1.5 flex items-center justify-center text-[10px]">
              ADMIN
            </Badge>
          )}

          {/* Active indicator */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-primary rounded-r-full" />
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <div>{content}</div>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{title}</span>
            {badge && <Badge variant="secondary">{badge}</Badge>}
            {admin && <Badge variant="primary" className="text-[10px]">ADMIN</Badge>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

export default NavItem;
