
import React, { useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTagColor, getTagTextClass, getTagBackgroundClass } from "@/types/notes";

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'colored';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  onRemove,
  onClick,
  variant = 'default',
  size = 'md',
  className
}) => {
  const tagColor = useMemo(() => getTagColor(tag), [tag]);
  
  // Compute classes based on variant and size
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-colors",
    {
      // Variant classes
      "bg-muted text-muted-foreground hover:bg-muted/80": variant === 'default',
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === 'outline',
      [getTagBackgroundClass(tag)]: variant === 'colored',
      [getTagTextClass(tag)]: variant === 'colored',
      
      // Size classes
      "text-xs px-2 py-0.5": size === 'sm',
      "text-sm px-2.5 py-0.5": size === 'md',
      "px-3 py-1": size === 'lg',
      
      // Cursor style for click
      "cursor-pointer": !!onClick
    },
    className
  );

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <span 
      className={classes} 
      style={variant === 'colored' ? { backgroundColor: `${tagColor}20`, color: tagColor } : undefined}
      onClick={handleClick}
    >
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full hover:bg-muted w-4 h-4 inline-flex items-center justify-center"
          aria-label={`Remove ${tag} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default TagBadge;
