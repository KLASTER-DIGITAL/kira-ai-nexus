
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

export type SortOption = 
  | 'created_desc' 
  | 'created_asc' 
  | 'updated_desc' 
  | 'title_asc' 
  | 'title_desc';

export type GroupByOption = 
  | 'none' 
  | 'tags' 
  | 'date';

export interface NoteGroup {
  title: string;
  notes: Note[];
  isExpanded?: boolean;
}

export interface NotesQueryOptions {
  filter?: NoteFilter;
  page?: number;
  pageSize?: number;
  sort?: SortOption;
}
