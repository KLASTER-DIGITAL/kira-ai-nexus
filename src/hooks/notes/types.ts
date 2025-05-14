
import { Note } from "@/types/notes";

export interface NoteFilter {
  searchText?: string;
  tags?: string[];
}

export interface NoteInput {
  title: string;
  content: string;
  tags?: string[];
}

export interface PaginatedNotes {
  notes: Note[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
