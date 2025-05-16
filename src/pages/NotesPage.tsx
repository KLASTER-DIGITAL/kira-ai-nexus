
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import NotesContent from "@/components/notes/content/NotesContent";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNotesListState } from "@/hooks/notes/useNotesListState";
import { useNotesGrouping } from "@/hooks/notes/useNotesGrouping";

const NotesPage: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Use the hooks for managing notes state
  const notesState = useNotesListState();
  const {
    notes,
    isLoading,
    handleNewNote,
    handleEditNote,
    handleDeletePrompt,
    clearFilters,
    totalCount,
    hasActiveFilters,
    groupByOption,
  } = notesState;
  
  // Get note groups if needed
  const noteGroups = useNotesGrouping(notes || [], groupByOption);

  const actions = (
    <Button 
      variant="default" 
      onClick={() => handleNewNote()}
      className="flex items-center gap-1"
    >
      <PlusCircle className="h-4 w-4" /> 
      Создать заметку
    </Button>
  );

  return (
    <DashboardLayout title="Заметки" actions={actions}>
      <div className="container mx-auto pb-20">
        <NotesContent 
          notes={notes || []}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          groupByOption={groupByOption}
          noteGroups={noteGroups}
          onEdit={handleEditNote}
          onDelete={handleDeletePrompt}
          onNewNote={handleNewNote}
          onClearFilters={clearFilters}
          totalCount={totalCount}
        />
      </div>
    </DashboardLayout>
  );
};

export default NotesPage;
