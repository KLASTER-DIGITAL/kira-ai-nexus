
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import NoteCardGrid from "./NoteCardGrid";
import { Note } from "@/types/notes";
import { NoteGroup as NoteGroupType } from "@/hooks/notes/types";
import { Badge } from "@/components/ui/badge";

interface NotesGroupProps {
  group: NoteGroupType;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NotesGroup: React.FC<NotesGroupProps> = ({ group, onEdit, onDelete }) => {
  // Fix: Use explicit boolean value rather than relying on group.isExpanded which might be undefined
  const [isExpanded, setIsExpanded] = useState<boolean>(group.isExpanded !== false);
  
  return (
    <div className="mb-8">
      <div 
        className="flex items-center mb-4 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 mr-2 text-muted-foreground group-hover:text-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 mr-2 text-muted-foreground group-hover:text-foreground" />
        )}
        <h3 className="font-medium">
          {group.title}
          <Badge variant="outline" className="ml-2">
            {group.notes.length}
          </Badge>
        </h3>
      </div>

      {isExpanded && (
        <NoteCardGrid
          notes={group.notes}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default NotesGroup;
