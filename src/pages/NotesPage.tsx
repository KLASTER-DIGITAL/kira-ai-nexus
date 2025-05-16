
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNotesListState } from "@/hooks/notes/useNotesListState";
import { useNotesGrouping } from "@/hooks/notes/useNotesGrouping";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/PageHeader";
import NotesContent from "@/components/notes/content/NotesContent";
import NotesDialogs from "@/components/notes/dialogs/NotesDialogs";

const NotesPage: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
    handleSaveNote,
    handleConfirmDelete,
    activeNote,
    handleNoteSelect
  } = notesState;
  
  // Get note groups if needed
  const noteGroups = useNotesGrouping(notes || [], groupByOption);

  useEffect(() => {
    const unsubscribe = notesState.setupRealtimeSubscription();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleCreateNote = () => {
    console.log("Создаём новую заметку");
    try {
      handleNewNote();
      setIsEditorOpen(true);
    } catch (error) {
      console.error("Ошибка при создании заметки:", error);
      toast.error("Не удалось создать заметку. Попробуйте еще раз.");
    }
  };

  const actions = (
    <Button 
      variant="default" 
      onClick={handleCreateNote}
      className="flex items-center gap-1"
    >
      <PlusCircle className="h-4 w-4" /> 
      Создать заметку
    </Button>
  );

  return (
    <div className="container mx-auto pb-20">
      <PageHeader 
        actions={actions} 
        description="Управляйте вашими заметками, создавайте новые и организуйте их"
      />
      
      <NotesContent 
        notes={notes || []}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        groupByOption={groupByOption}
        noteGroups={noteGroups}
        onEdit={handleEditNote}
        onDelete={handleDeletePrompt}
        onNewNote={handleCreateNote}
        onClearFilters={clearFilters}
        totalCount={totalCount}
      />
      
      <NotesDialogs
        isEditorOpen={isEditorOpen}
        setIsEditorOpen={setIsEditorOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        activeNote={activeNote}
        onSaveNote={handleSaveNote}
        onConfirmDelete={handleConfirmDelete}
        onNoteSelect={handleNoteSelect}
      />
    </div>
  );
};

export default NotesPage;
