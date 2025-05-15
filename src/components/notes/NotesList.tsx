
import React, { useEffect } from "react";
import { useNotesGrouping } from "@/hooks/notes/useNotesGrouping";
import { useNotesKeyboardShortcuts } from "@/hooks/notes/useNotesKeyboardShortcuts";
import NotesHeader from "./header/NotesHeader";
import FilterBar from "./filters/FilterBar";
import NotesContent from "./content/NotesContent";
import NotesPagination from "./pagination/NotesPagination";
import NotesDialogs from "./dialogs/NotesDialogs";
import { useNotesListState } from "@/hooks/notes/useNotesListState";

const NotesList: React.FC = () => {
  // Use our custom hook for notes list state management
  const {
    notes,
    isLoading,
    activeNote,
    isEditorOpen,
    setIsEditorOpen,
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
    setupRealtimeSubscription
  } = useNotesListState();
  
  // Use our notes grouping hook
  const noteGroups = useNotesGrouping(notes || [], groupByOption);

  // Set up keyboard shortcuts
  useNotesKeyboardShortcuts({
    onNewNote: handleNewNote,
    isEditorOpen,
    onCloseEditor: () => setIsEditorOpen(false),
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

  return (
    <div>
      <NotesHeader onNewNote={handleNewNote} />

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
        onEdit={handleEditNote}
        onDelete={handleDeletePrompt}
        onNewNote={handleNewNote}
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

export default NotesList;
