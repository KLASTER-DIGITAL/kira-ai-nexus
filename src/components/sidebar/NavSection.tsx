
import React from "react";
import { cn } from "@/lib/utils";

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
}

const NavSection: React.FC<NavSectionProps> = ({ title, children }) => {
  if (!title) {
    return (
      <div className="mb-5 space-y-1">
        {children}
      </div>
    );
  }
  
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default NavSection;
