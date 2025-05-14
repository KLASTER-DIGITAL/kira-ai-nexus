
import { UserProfile } from './auth';

export interface Note {
  id: string;
  title: string;
  content: string | null;
  date?: string;
  color?: string;
  user_id: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
  type: string;
  user?: UserProfile;
}

export type NoteColor = 
  | 'bg-yellow-100' 
  | 'bg-blue-100' 
  | 'bg-green-100' 
  | 'bg-red-100' 
  | 'bg-purple-100';

export interface NoteTag {
  id: string;
  name: string;
  color?: string;
}
