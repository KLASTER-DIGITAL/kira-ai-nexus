import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Note } from "@/types/notes";
import { cn } from "@/lib/utils";

interface NoteNodeProps {
  data: {
    note: Note;
  };
  selected: boolean;
}

const NoteNode: React.FC<NoteNodeProps> = ({ data, selected }) => {
  const { note } = data;
  
  const handleStyle = {
    width: 6,
    height: 6,
    backgroundColor: "#9d5cff",
    border: "1px solid white",
  };
  
  // Function to strip HTML tags for preview
  const stripHtml = (html?: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  // Get a short preview of the content
  const contentPreview = stripHtml(note.content)?.substring(0, 30);
  
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg shadow-md transition-all bg-card border w-[180px]",
        selected ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="font-medium text-sm truncate">{note.title}</div>
      {contentPreview && (
        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {contentPreview}...
        </div>
      )}
      
      {/* Show tags if available */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap mt-2 gap-1">
          {note.tags.slice(0, 2).map((tag, index) => (
            <div
              key={index}
              className="bg-muted px-1.5 py-0.5 text-[10px] rounded"
            >
              {tag}
            </div>
          ))}
          {note.tags.length > 2 && (
            <div className="bg-muted px-1.5 py-0.5 text-[10px] rounded">
              +{note.tags.length - 2}
            </div>
          )}
        </div>
      )}
      
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 6,
          height: 6,
          backgroundColor: "#9d5cff",
          border: "1px solid white",
        }}
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 6,
          height: 6,
          backgroundColor: "#9d5cff",
          border: "1px solid white",
        }}
        isConnectable={false}
      />
    </div>
  );
};

export default memo(NoteNode);
