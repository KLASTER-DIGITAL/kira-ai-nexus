
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Note } from "@/types/notes";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import TagBadge from "./TagBadge";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  // Format date to Russian locale
  const formattedDate = format(new Date(note.updated_at || note.created_at || new Date()), "d MMMM yyyy, HH:mm", {
    locale: ru,
  });

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Truncate content for preview by stripping HTML
  const contentPreview = note.content 
    ? stripHtml(note.content).substring(0, 150) + (stripHtml(note.content).length > 150 ? "..." : "")
    : "";

  // Check if note has tags
  const hasTags = note.tags && Array.isArray(note.tags) && note.tags.length > 0;

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-all h-full flex flex-col",
        note.color || "" // Apply note color if available
      )} 
      onClick={() => onEdit(note)}
    >
      <CardHeader className="pb-2">
        <h3 className="font-medium text-lg line-clamp-2">{note.title}</h3>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {contentPreview && (
          <p className="text-muted-foreground whitespace-pre-line line-clamp-3 text-sm">
            {contentPreview}
          </p>
        )}
        
        {hasTags && (
          <div className="mt-3 flex flex-wrap gap-1">
            {note.tags.map((tag, index) => (
              <TagBadge 
                key={index} 
                tag={tag} 
                variant="colored"
                size="sm"
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 mt-auto border-t border-border">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            title="Редактировать"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            title="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
