
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/PageHeader";
import { NotesGraph } from "@/components/notes/graph";
import { NoteSidebar } from "@/components/notes/sidebar";
import DeleteNoteDialog from "@/components/notes/DeleteNoteDialog";
import { useNotesListState } from "@/hooks/notes/useNotesListState";

const NotesGraphPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Use the hooks for managing notes state
  const {
    notes,
    isLoading,
    handleNewNote,
    handleEditNote,
    handleDeletePrompt,
    handleSaveNote,
    handleConfirmDelete,
    activeNote,
    handleNoteSelect,
    updateNote,
    deleteNote,
    setupRealtimeSubscription
  } = useNotesListState();

  useEffect(() => {
    const unsubscribe = setupRealtimeSubscription();
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
  
  const onNodeClick = (nodeId: string) => {
    // Find the note by ID and edit it
    const note = notes?.find(n => n.id === nodeId);
    if (note) {
      handleEditNote(note);
      setIsSidebarOpen(true);
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
        description="Визуализация связей между вашими заметками"
      />
      
      <div className="mt-6 h-[70vh] border rounded-md bg-background">
        <NotesGraph 
          onNodeClick={onNodeClick} 
        />
      </div>
      
      {/* Note Sidebar */}
      <NoteSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        activeNote={activeNote}
        isNew={!activeNote}
        onSaveNote={handleSaveNote}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
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
          return success;
        }}
        noteTitle={activeNote?.title}
      />
    </div>
  );
};

export default NotesGraphPage;
