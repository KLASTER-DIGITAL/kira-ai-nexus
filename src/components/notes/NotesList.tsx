
import React, { useState } from "react";
import { Plus, Search, X, Filter, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/notes";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const NotesList: React.FC = () => {
  // Local state for UI management
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Use our notes hook
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes({
    searchText: searchText || undefined,
  });

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

  // Extract all unique tags from notes
  const allTags = React.useMemo(() => {
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

  // Filter notes by selected tags
  const filteredNotes = React.useMemo(() => {
    if (!notes) return [];
    if (selectedTags.length === 0) return notes;
    
    return notes.filter(note => {
      if (!note.tags || note.tags.length === 0) return false;
      return selectedTags.some(tag => note.tags.includes(tag));
    });
  }, [notes, selectedTags]);

  // Clear all filters
  const clearFilters = () => {
    setSearchText("");
    setSelectedTags([]);
  };

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

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
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск заметок..."
            className="pl-9 pr-9"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button 
              onClick={() => setSearchText("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 relative">
              <Filter className="h-4 w-4" />
              {selectedTags.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Фильтр по тегам</span>
                {selectedTags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                    Сбросить
                  </Button>
                )}
              </div>
              
              {allTags.length > 0 ? (
                <ScrollArea className="h-60">
                  <div className="space-y-1">
                    {allTags.map(tag => (
                      <div 
                        key={tag} 
                        className={`flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-accent ${
                          selectedTags.includes(tag) ? "bg-accent" : ""
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        <div className="flex-1">
                          <Badge variant={selectedTags.includes(tag) ? "default" : "outline"}>
                            {tag}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="py-2 text-center text-sm text-muted-foreground">
                  Нет доступных тегов
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Активные фильтры:</span>
          
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6">
              Сбросить все
            </Button>
          )}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center my-10">
          <p>Загрузка заметок...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-10 text-center">
          {hasActiveFilters ? (
            <>
              <p className="text-muted-foreground mb-4">По вашему запросу ничего не найдено</p>
              <Button onClick={clearFilters}>Сбросить фильтры</Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">У вас пока нет заметок</p>
              <Button onClick={handleNewNote}>Создать первую заметку</Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      )}

      {/* Note Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {activeNote ? "Редактирование заметки" : "Создание заметки"}
            </DialogTitle>
          </DialogHeader>
          <NoteEditor
            note={activeNote}
            onSave={handleSaveNote}
            onCancel={() => setIsEditorOpen(false)}
            isNew={!activeNote}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Заметка "{activeNote?.title}" будет удалена безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotesList;
