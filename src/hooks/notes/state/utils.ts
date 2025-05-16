
import { Note } from "@/types/notes";

/**
 * Extract all unique tags from a list of notes
 */
export const extractUniqueTags = (notes?: Note[]): string[] => {
  if (!notes || notes.length === 0) return [];
  return [...new Set(notes.flatMap(note => note.tags || []))];
};
