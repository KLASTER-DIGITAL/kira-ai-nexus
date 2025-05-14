
import React, { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import { useNotes, Note } from "@/hooks/useNotes";
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

const NotesList: React.FC = () => {
  // Local state for UI management
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [searchText, setSearchText] = useState("");

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
  const handleSaveNote = (noteData: { title: string; content: string }) => {
    if (activeNote) {
      // Update existing note
      updateNote({
        id: activeNote.id,
        title: noteData.title,
        content: noteData.content,
      });
    } else {
      // Create new note
      createNote({
        title: noteData.title,
        content: noteData.content,
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

      {/* Search input */}
      <div className="relative mb-4">
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
      
      {isLoading ? (
        <div className="flex justify-center my-10">
          <p>Загрузка заметок...</p>
        </div>
      ) : notes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-10 text-center">
          <p className="text-muted-foreground mb-4">У вас пока нет заметок</p>
          <Button onClick={handleNewNote}>Создать первую заметку</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes?.map((note) => (
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
