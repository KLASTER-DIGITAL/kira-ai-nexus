
import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const TaskItemView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  getPos,
  editor,
}) => {
  const { checked, priority } = node.attrs;

  const onCheckboxChange = () => {
    updateAttributes({ checked: !checked });
  };

  return (
    <NodeViewWrapper
      className={cn(
        "flex gap-2 items-start my-1 group task-item",
        checked && "text-muted-foreground"
      )}
      data-priority={priority}
      data-checked={checked}
    >
      <div className="flex-shrink-0 pt-1">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckboxChange}
          className={cn(
            "cursor-pointer",
            priority === "high" && "border-destructive",
            priority === "medium" && "border-amber-500",
            priority === "low" && "border-gray-400"
          )}
        />
      </div>
      <div 
        className={cn(
          "flex-grow task-content",
          checked && "line-through"
        )}
      >
        {/* Content is rendered here automatically */}
      </div>
    </NodeViewWrapper>
  );
};

export default TaskItemView;
