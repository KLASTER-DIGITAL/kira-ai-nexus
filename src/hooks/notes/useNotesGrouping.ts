
import { useMemo } from 'react';
import { Note } from '@/types/notes';
import { GroupByOption, NoteGroup } from './types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const useNotesGrouping = (
  notes: Note[],
  groupBy: GroupByOption
): NoteGroup[] => {
  return useMemo(() => {
    if (groupBy === 'none' || !notes || notes.length === 0) {
      return [{
        title: 'Все заметки',
        notes: notes || [],
        isExpanded: true
      }];
    }

    if (groupBy === 'tags') {
      const notesByTag: Record<string, Note[]> = {};
      const notesWithoutTags: Note[] = [];
      
      // Group notes by tags
      notes.forEach(note => {
        if (!note.tags || note.tags.length === 0) {
          notesWithoutTags.push(note);
          return;
        }
        
        note.tags.forEach(tag => {
          if (!notesByTag[tag]) {
            notesByTag[tag] = [];
          }
          notesByTag[tag].push(note);
        });
      });
      
      // Create groups array
      const groups: NoteGroup[] = Object.keys(notesByTag)
        .sort()
        .map(tag => ({
          title: `#${tag}`,
          notes: notesByTag[tag],
          isExpanded: true
        }));
      
      // Add group for notes without tags
      if (notesWithoutTags.length > 0) {
        groups.push({
          title: 'Без тегов',
          notes: notesWithoutTags,
          isExpanded: true
        });
      }
      
      return groups;
    }

    if (groupBy === 'date') {
      const notesByDate: Record<string, Note[]> = {};
      
      // Group notes by date
      notes.forEach(note => {
        if (!note.created_at) return;
        
        const date = new Date(note.created_at);
        const dateKey = format(date, 'yyyy-MM-dd');
        const displayDate = format(date, 'd MMMM yyyy', { locale: ru });
        
        if (!notesByDate[dateKey]) {
          notesByDate[dateKey] = [];
        }
        
        notesByDate[dateKey].push(note);
      });
      
      // Create groups array
      return Object.keys(notesByDate)
        .sort()
        .reverse()
        .map(dateKey => {
          const date = new Date(dateKey);
          return {
            title: format(date, 'd MMMM yyyy', { locale: ru }),
            notes: notesByDate[dateKey],
            isExpanded: true
          };
        });
    }
    
    return [{
      title: 'Все заметки',
      notes: notes,
      isExpanded: true
    }];
  }, [notes, groupBy]);
};
