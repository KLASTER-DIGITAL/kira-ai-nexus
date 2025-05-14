
import React from "react";
import { Note } from "@/types/notes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TipTapEditor from "./TipTapEditor";
import { useNoteLinks } from "@/hooks/notes/useNoteLinks";
import BacklinksList from "./BacklinksList";

interface NoteViewerProps {
  note: Note;
  onNoteSelect?: (noteId: string) => void;
}

const NoteViewer: React.FC<NoteViewerProps> = ({ note, onNoteSelect }) => {
  const { links } = useNoteLinks(note.id);
  const hasBacklinks = links?.incomingLinks && links.incomingLinks.length > 0;

  const handleWikiLinkClick = (noteId: string) => {
    if (onNoteSelect) {
      onNoteSelect(noteId);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">{note.title}</h2>
      </CardHeader>
      <CardContent>
        <TipTapEditor
          content={note.content || ""}
          onChange={() => {}}
          editable={false}
          noteId={note.id}
          onLinkClick={handleWikiLinkClick}
        />
        
        {hasBacklinks && (
          <div className="mt-4">
            <BacklinksList 
              links={links.incomingLinks} 
              onLinkClick={handleWikiLinkClick}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteViewer;
