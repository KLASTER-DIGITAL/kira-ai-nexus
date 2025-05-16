import React, { useEffect } from "react";
import { useNotesGrouping } from "@/hooks/notes/useNotesGrouping";
import { useNotesKeyboardShortcuts } from "@/hooks/notes/useNotesKeyboardShortcuts";
import NotesHeader from "./header/NotesHeader";
import FilterBar from "./filters/FilterBar";
import NotesContent from "./content/NotesContent";
import NotesPagination from "./pagination/NotesPagination";
import { NoteSidebar } from "./sidebar";
import DeleteNoteDialog from "./DeleteNoteDialog";
import { useNotesListState } from "@/hooks/notes/useNotesListState";

const NotesList: React.FC = () => {
  // Use our custom hook for notes list state management
  const {
    notes,
    isLoading,
    activeNote,
    isEditorOpen: isDialogOpen,
    setIsEditorOpen: setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    searchText,
    setSearchText,
    selectedTags,
    currentPage,
    setCurrentPage,
    sortOption,
    setSortOption,
    groupByOption,
    setGroupByOption,
    totalPages,
    totalCount,
    allTags,
    hasActiveFilters,
    
    handleNewNote,
    handleEditNote,
    handleDeletePrompt,
    handleSaveNote,
    handleConfirmDelete,
    handleNoteSelect,
    toggleTag,
    clearFilters,
    setupRealtimeSubscription,
    updateNote,
    deleteNote
  } = useNotesListState();
  
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  // Use our notes grouping hook
  const noteGroups = useNotesGrouping(notes || [], groupByOption);

  // Setup keyboard shortcuts
  useNotesKeyboardShortcuts({
    onNewNote: () => {
      handleNewNote();
      setIsSidebarOpen(true);
    },
    isEditorOpen: isSidebarOpen,
    onCloseEditor: () => setIsSidebarOpen(false),
    onNextPage: () => {
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    },
    onPrevPage: () => {
      if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    },
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1
  });

  // Set up realtime subscription
  useEffect(() => {
    return setupRealtimeSubscription();
  }, []);
  
  // Handle note creation
  const handleCreateNote = () => {
    handleNewNote();
    setIsSidebarOpen(true);
  };
  
  // Handle note editing
  const handleNoteEdit = (note) => {
    handleEditNote(note);
    setIsSidebarOpen(true);
  };

  return (
    <div>
      <NotesHeader onNewNote={handleCreateNote} />

      <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        clearFilters={clearFilters}
        allTags={allTags}
        sortOption={sortOption}
        setSortOption={setSortOption}
        groupByOption={groupByOption}
        setGroupByOption={setGroupByOption}
      />

      <NotesContent 
        notes={notes || []}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        groupByOption={groupByOption}
        noteGroups={noteGroups}
        onEdit={handleNoteEdit}
        onDelete={handleDeletePrompt}
        onNewNote={handleCreateNote}
        onClearFilters={clearFilters}
        totalCount={totalCount}
      />

      {totalPages > 1 && (
        <NotesPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

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

      {/* Keep existing dialogs for compatibility */}
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

export default NotesList;
