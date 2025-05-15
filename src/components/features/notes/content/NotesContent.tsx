
import React from "react";
import { Note } from "@/types/notes";
import NoteCardGrid from "@/components/notes/NoteCardGrid";
import EmptyState from "@/components/notes/EmptyState";
import NotesGroup from "@/components/notes/NotesGroup";
import { NoteGroup } from "@/hooks/notes/types";

interface NotesContentProps {
  notes: Note[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  groupByOption: string;
  noteGroups: NoteGroup[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onNewNote: () => void;
  onClearFilters: () => void;
  totalCount: number;
}

const NotesContent: React.FC<NotesContentProps> = ({
  notes,
  isLoading,
  hasActiveFilters,
  groupByOption,
  noteGroups,
  onEdit,
  onDelete,
  onNewNote,
  onClearFilters,
  totalCount
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center my-10">
        <p>Загрузка заметок...</p>
      </div>
    );
  }

  if (notes && notes.length === 0) {
    return (
      <EmptyState
        hasFilters={hasActiveFilters}
        onCreateNew={onNewNote}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <>
      {/* Display notes grouped or ungrouped */}
      {groupByOption === 'none' ? (
        <NoteCardGrid
          notes={notes || []}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        noteGroups.map((group, index) => (
          <NotesGroup
            key={`${group.title}-${index}`}
            group={group}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
      
      {totalCount > 0 && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          Всего: {totalCount} заметок
        </div>
      )}
    </>
  );
};

export default NotesContent;
