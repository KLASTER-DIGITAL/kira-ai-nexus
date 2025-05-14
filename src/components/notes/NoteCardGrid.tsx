
import React from "react";
import NoteCard from "./NoteCard";
import { Note } from "@/types/notes";

interface NoteCardGridProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteCardGrid: React.FC<NoteCardGridProps> = ({ 
  notes, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NoteCardGrid;
