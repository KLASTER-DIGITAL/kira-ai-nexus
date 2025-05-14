
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getTagBackgroundClass, getTagTextClass } from "@/types/notes";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "colored";
  size?: "default" | "sm";
}

const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  onRemove,
  onClick,
  className,
  variant = "default",
  size = "default"
}) => {
  const bgColorClass = getTagBackgroundClass(tag);
  const textColorClass = getTagTextClass(tag);
  
  const isColored = variant === "colored";
  const isClickable = !!onClick;
  const isRemovable = !!onRemove;
  
  // Determine classes based on variant and size
  const variantClasses = {
    default: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-border text-foreground hover:bg-secondary/10",
    colored: `border-transparent ${bgColorClass} ${textColorClass} hover:opacity-90`
  };
  
  const sizeClasses = {
    default: "px-2.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-[0.65rem]"
  };
  
  return (
    <Badge
      className={cn(
        isClickable && "cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        "transition-all flex items-center gap-1",
        className
      )}
      onClick={onClick}
    >
      {tag}
      {isRemovable && (
        <X 
          className="h-3 w-3 cursor-pointer hover:text-foreground/80" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </Badge>
  );
};

export default TagBadge;
