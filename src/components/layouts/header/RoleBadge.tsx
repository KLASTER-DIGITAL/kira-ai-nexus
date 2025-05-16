
import React from "react";
import { useAuth } from "@/context/auth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  className?: string;
}

export function RoleBadge({ className }: RoleBadgeProps) {
  const { profile } = useAuth();
  
  if (profile?.role !== "superadmin") {
    return null;
  }
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "bg-destructive/10 text-destructive border-destructive/20 ml-2 h-5 text-xs",
        className
      )}
    >
      ADMIN
    </Badge>
  );
}
