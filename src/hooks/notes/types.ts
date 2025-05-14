
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
