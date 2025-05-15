
import React from "react";
import { Button } from "@/components/ui/button";
import { MenuButtonProps, MenuDividerProps } from "./types";

export const MenuButton: React.FC<MenuButtonProps> = ({
  editor,
  isActive,
  onClick,
  title,
  disabled = false,
  children,
}) => {
  return (
    <Button
      size="sm"
      variant="ghost"
      className={isActive ? "bg-muted" : ""}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export const MenuDivider: React.FC<MenuDividerProps> = ({ className = "" }) => {
  return <span className={`h-6 w-px bg-muted mx-1 ${className}`}></span>;
};
