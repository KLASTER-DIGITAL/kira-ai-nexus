
import React from "react";
import { Note, NoteContent } from "@/types/notes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TipTapEditor from "./TipTapEditor";
import { useNoteLinks } from "@/hooks/notes/useNoteLinks";
import BacklinksList from "./BacklinksList";
import NoteTasks from "./NoteTasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, ListTodo } from "lucide-react";

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
        
        {(hasBacklinks || note.id) && (
          <div className="mt-6">
            <Tabs defaultValue="links" className="w-full">
              <TabsList>
                <TabsTrigger value="links" className="flex items-center gap-1">
                  <Link2 className="h-4 w-4" />
                  <span>Связи</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-1">
                  <ListTodo className="h-4 w-4" />
                  <span>Задачи</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="links">
                {hasBacklinks ? (
                  <BacklinksList 
                    links={formattedLinks}
                    onLinkClick={handleWikiLinkClick}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-3">
                    Нет входящих ссылок
                  </div>
                )}
              </TabsContent>
              <TabsContent value="tasks">
                <NoteTasks noteId={note.id} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteViewer;
