
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNotesListState } from "@/hooks/notes/useNotesListState";
import { useNotesGrouping } from "@/hooks/notes/useNotesGrouping";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/PageHeader";
import NotesContent from "@/components/notes/content/NotesContent";
import { NoteSidebar } from "@/components/notes/sidebar";
import DeleteNoteDialog from "@/components/notes/DeleteNoteDialog";

const NotesPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      setIsSidebarOpen(true);
    } catch (error) {
      console.error("Ошибка при создании заметки:", error);
      toast.error("Не удалось создать заметку. Попробуйте еще раз.");
    }
  };
  
  const onEditNote = (note) => {
    handleEditNote(note);
    setIsSidebarOpen(true);
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
        onEdit={onEditNote}
        onDelete={handleDeletePrompt}
        onNewNote={handleCreateNote}
        onClearFilters={clearFilters}
        totalCount={totalCount}
      />
      
      {/* Note Sidebar Editor */}
      <NoteSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        activeNote={activeNote}
        isNew={!activeNote}
        onSaveNote={handleSaveNote}
        onUpdateNote={notesState.updateNote}
        onDeleteNote={notesState.deleteNote}
        onNoteSelect={handleNoteSelect}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={async () => {
          const success = await handleConfirmDelete();
          if (success) {
            setIsDeleteDialogOpen(false);
          }
        }}
        noteTitle={activeNote?.title}
      />
    </div>
  );
};

export default NotesPage;
