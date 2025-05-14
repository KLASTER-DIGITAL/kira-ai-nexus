
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Note, NoteColor } from '@/types/notes';

// Mock data and functions for now
// In a real implementation this would connect to your Supabase backend
const mockNotes: Note[] = [
  {
    id: "1",
    title: "План разработки KIRA AI",
    content: "1. Создать MVP версию\n2. Добавить интеграцию с OpenAI\n3. Разработать MiniApps Marketplace",
    date: "2025-05-13",
    color: "bg-yellow-100",
  },
  {
    id: "2",
    title: "Функции для следующего релиза",
    content: "- Голосовой интерфейс\n- Интеграция с календарем\n- Расширенная аналитика",
    date: "2025-05-13",
    color: "bg-blue-100",
  },
];

interface NoteFilter {
  searchText?: string;
  tags?: string[];
}

export const useNotes = (filter?: NoteFilter) => {
  const queryClient = useQueryClient();
  
  // Fetch notes with optional filtering
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notes', filter],
    queryFn: async () => {
      // In real implementation this would be a fetch to Supabase
      // With filters applied to the query
      return mockNotes.filter(note => {
        if (!filter) return true;
        
        let matches = true;
        
        if (filter.searchText) {
          const searchLower = filter.searchText.toLowerCase();
          matches = matches && (
            note.title.toLowerCase().includes(searchLower) ||
            note.content.toLowerCase().includes(searchLower)
          );
        }
        
        return matches;
      });
    }
  });

  // Create new note
  const createNoteMutation = useMutation({
    mutationFn: async (newNote: Omit<Note, 'id' | 'date'>) => {
      // In real implementation this would be a POST to Supabase
      const note: Note = {
        ...newNote,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
      };
      return note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // Update note
  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: Note) => {
      // In real implementation this would be a PUT to Supabase
      return updatedNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // Delete note
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      // In real implementation this would be a DELETE to Supabase
      return noteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // Change note color
  const changeNoteColor = useCallback(
    (noteId: string, color: NoteColor) => {
      const note = notes?.find((n) => n.id === noteId);
      if (note) {
        updateNoteMutation.mutate({
          ...note,
          color,
        });
      }
    },
    [notes, updateNoteMutation]
  );

  return {
    notes,
    isLoading,
    error,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    changeNoteColor,
  };
};
