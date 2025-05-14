
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Note } from "@/hooks/useNotes";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  // Format date to Russian locale
  const formattedDate = format(new Date(note.updated_at), "d MMMM yyyy, HH:mm", {
    locale: ru,
  });

  // Truncate content for preview by stripping HTML
  const contentPreview = note.content 
    ? stripHtml(note.content).substring(0, 200) + (note.content.length > 200 ? "..." : "")
    : "";

  // Function to strip HTML tags for preview
  function stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => onEdit(note)}>
      <CardHeader className="pb-2">
        <h3 className="font-medium text-lg line-clamp-1">{note.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line line-clamp-4">
          {contentPreview}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
