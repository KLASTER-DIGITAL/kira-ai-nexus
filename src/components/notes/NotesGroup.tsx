
import React, { useState } from "react";
import { NoteGroup } from "@/hooks/notes/types";
import { Note } from "@/types/notes";
import NoteCardGrid from "./NoteCardGrid";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import TagBadge from "./TagBadge";

interface NotesGroupProps {
  group: NoteGroup;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NotesGroup: React.FC<NotesGroupProps> = ({ group, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Skip rendering if there are no notes in this group
  if (group.notes.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <div 
        className="flex items-center gap-2 mb-3 cursor-pointer" 
        onClick={toggleExpand}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        
        <div className="flex items-center">
          {/* If the group title is a tag, display it with TagBadge */}
          {group.title.startsWith('#') ? (
            <TagBadge 
              tag={group.title.substring(1)} 
              variant="colored"
              size="md"
              className="px-3 py-1"
            />
          ) : (
            <h3 className="font-semibold">{group.title}</h3>
          )}
          <span className="text-sm text-muted-foreground ml-2">
            ({group.notes.length})
          </span>
        </div>
      </div>
      
      <div className={cn(
        "transition-all",
        isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <NoteCardGrid 
          notes={group.notes} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>
    </div>
  );
};

export default NotesGroup;
