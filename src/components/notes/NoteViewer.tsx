
import React from "react";
import { Note, NoteContent } from "@/types/notes";
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
  
  // Transform incomingLinks to the format expected by BacklinksList
  const formattedLinks = links?.incomingLinks?.map(link => ({
    id: link.id,
    nodes: {
      id: link.source.id,
      title: link.source.title
    }
  })) || [];
  
  // Get content as string
  const getNoteContent = (): string => {
    if (typeof note.content === 'string') {
      return note.content;
    } else if (note.content && typeof note.content === 'object') {
      return note.content.text || '';
    }
    return '';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">{note.title}</h2>
      </CardHeader>
      <CardContent>
        <TipTapEditor
          content={getNoteContent()}
          onChange={() => {}}
          editable={false}
          noteId={note.id}
          onLinkClick={handleWikiLinkClick}
        />
        
        {hasBacklinks && (
          <div className="mt-4">
            <BacklinksList 
              links={formattedLinks}
              onLinkClick={handleWikiLinkClick}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteViewer;
