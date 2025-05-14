
import { useEffect, useCallback } from 'react';

interface NotesKeyboardShortcutsProps {
  onNewNote: () => void;
  isEditorOpen: boolean;
  onCloseEditor: () => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export const useNotesKeyboardShortcuts = ({
  onNewNote,
  isEditorOpen,
  onCloseEditor,
  onNextPage,
  onPrevPage,
  canGoNext,
  canGoPrev
}: NotesKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Alt/Option + N to create new note
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      onNewNote();
    }
    
    // Escape to close editor
    if (e.key === 'Escape' && isEditorOpen) {
      onCloseEditor();
    }
    
    // Alt/Option + Right/Left for pagination
    if (e.altKey && e.key === 'ArrowRight' && canGoNext) {
      e.preventDefault();
      onNextPage();
    }
    
    if (e.altKey && e.key === 'ArrowLeft' && canGoPrev) {
      e.preventDefault();
      onPrevPage();
    }
  }, [isEditorOpen, onNewNote, onCloseEditor, onNextPage, onPrevPage, canGoNext, canGoPrev]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
