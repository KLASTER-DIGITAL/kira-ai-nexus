
import React from "react";
import { Note } from "@/types/notes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TipTapEditor from "./TipTapEditor";

interface NoteViewerProps {
  note: Note;
}

const NoteViewer: React.FC<NoteViewerProps> = ({ note }) => {
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
        />
      </CardContent>
    </Card>
  );
};

export default NoteViewer;
