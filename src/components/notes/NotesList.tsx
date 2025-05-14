
import React, { useState, useMemo, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/notes";
import FilterBar from "./filters/FilterBar";
import EmptyState from "./EmptyState";
import NoteCardGrid from "./NoteCardGrid";
import DeleteNoteDialog from "./DeleteNoteDialog";
import NoteEditDialog from "./NoteEditDialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NotesList: React.FC = () => {
  // Local state for UI management
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const { toast } = useToast();

  // Use our notes hook with pagination
  const { notes, isLoading, createNote, updateNote, deleteNote, totalPages, totalCount } = useNotes({
    filter: {
      searchText: searchText || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    },
    page: currentPage,
    pageSize
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('notes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'nodes', filter: "type=eq.note" }, 
        (payload) => {
          console.log('Notes change detected:', payload);
          // We'll let React Query handle the cache update via invalidation
          // just show a toast to inform the user
          if (payload.eventType === 'INSERT' && payload.new) {
            toast({
              title: "Новая заметка",
              description: "Кто-то добавил новую заметку",
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            toast({
              title: "Заметка обновлена",
              description: "Заметка была обновлена",
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            toast({
              title: "Заметка удалена",
              description: "Заметка была удалена",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt/Option + N to create new note
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }
      
      // Escape to close editor
      if (e.key === 'Escape' && isEditorOpen) {
        setIsEditorOpen(false);
      }
      
      // Alt/Option + Right/Left for pagination
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
        }
      }
      
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditorOpen, currentPage, totalPages]);

  // Handle opening the editor for a new note
  const handleNewNote = () => {
    setActiveNote(undefined);
    setIsEditorOpen(true);
  };

  // Handle editing a note
  const handleEditNote = (note: Note) => {
    setActiveNote(note);
    setIsEditorOpen(true);
  };

  // Handle saving a note (both new and edit)
  const handleSaveNote = (noteData: { title: string; content: string; tags: string[] }) => {
    if (activeNote) {
      // Update existing note
      updateNote({
        id: activeNote.id,
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
      });
    } else {
      // Create new note
      createNote({
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
      });
    }
    setIsEditorOpen(false);
  };

  // Handle opening the delete confirmation dialog
  const handleDeletePrompt = (noteId: string) => {
    const note = notes?.find((n) => n.id === noteId);
    if (note) {
      setActiveNote(note);
      setIsDeleteDialogOpen(true);
    }
  };

  // Handle confirming note deletion
  const handleConfirmDelete = () => {
    if (activeNote) {
      deleteNote(activeNote.id);
    }
    setIsDeleteDialogOpen(false);
  };

  // Handle note selection via wiki links
  const handleNoteSelect = (noteId: string) => {
    const selectedNote = notes?.find((note) => note.id === noteId);
    if (selectedNote) {
      handleEditNote(selectedNote);
    }
  };

  // Extract all unique tags from notes
  const allTags = useMemo(() => {
    if (!notes) return [];
    const tagSet = new Set<string>();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [notes]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText("");
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [
      1, 
      'ellipsis',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis',
      totalPages
    ];
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Мои заметки</h3>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleNewNote}
        >
          <Plus size={14} />
          <span>Новая заметка</span>
          <span className="ml-1 hotkey-indicator">Alt+N</span>
        </Button>
      </div>

      <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        clearFilters={clearFilters}
        allTags={allTags}
      />

      {isLoading ? (
        <div className="flex justify-center my-10">
          <p>Загрузка заметок...</p>
        </div>
      ) : notes && notes.length === 0 ? (
        <EmptyState
          hasFilters={hasActiveFilters}
          onCreateNew={handleNewNote}
          onClearFilters={clearFilters}
        />
      ) : (
        <>
          <NoteCardGrid
            notes={notes || []}
            onEdit={handleEditNote}
            onDelete={handleDeletePrompt}
          />
          
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {pageNumbers.map((page, index) => (
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(Number(page))}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
          
          {totalCount > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-2">
              Всего: {totalCount} заметок
            </div>
          )}
        </>
      )}

      {/* Note Editor Dialog */}
      <NoteEditDialog
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        activeNote={activeNote}
        onSaveNote={handleSaveNote}
        onNoteSelect={handleNoteSelect}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
        noteTitle={activeNote?.title}
      />
    </div>
  );
};

export default NotesList;
