
import { UserProfile } from './auth';

export interface NoteContent {
  text: string;
  tags: string[];
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string | NoteContent;
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
  | 'bg-purple-100'
  | 'bg-orange-100'
  | 'bg-pink-100'
  | 'bg-indigo-100'
  | 'bg-teal-100';

export interface NoteTag {
  id: string;
  name: string;
  color?: string;
}

// Tag color options for color picker
export const TAG_COLORS = {
  purple: '#9b87f5',
  blue: '#60A5FA',
  green: '#10B981',
  yellow: '#FBBF24',
  red: '#EF4444',
  pink: '#EC4899',
  indigo: '#6366F1',
  gray: '#6B7280',
  teal: '#14B8A6',
  orange: '#F97316',
};

// Note background color options
export const NOTE_COLORS = {
  default: { bg: '', label: 'По умолчанию' },
  yellow: { bg: 'bg-yellow-100', label: 'Жёлтый' },
  blue: { bg: 'bg-blue-100', label: 'Синий' },
  green: { bg: 'bg-green-100', label: 'Зелёный' },
  red: { bg: 'bg-red-100', label: 'Красный' },
  purple: { bg: 'bg-purple-100', label: 'Фиолетовый' },
  orange: { bg: 'bg-orange-100', label: 'Оранжевый' },
  pink: { bg: 'bg-pink-100', label: 'Розовый' },
  indigo: { bg: 'bg-indigo-100', label: 'Индиго' },
  teal: { bg: 'bg-teal-100', label: 'Бирюзовый' },
};

// Map tag names to default colors for consistent coloring
export function getTagColor(tagName: string): string {
  // Simple hash function to get consistent colors for the same tag names
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to a positive index within range of our color array
  const colorKeys = Object.keys(TAG_COLORS);
  const index = Math.abs(hash) % colorKeys.length;
  
  return TAG_COLORS[colorKeys[index] as keyof typeof TAG_COLORS];
}

// Get a CSS background color class based on tag name
export function getTagBackgroundClass(tagName: string): string {
  const color = getTagColor(tagName);
  
  // Convert hex to rgba with low opacity for background
  return `bg-[${color}20]`; // 20 is hex for 12% opacity
}

// Get a CSS text color class based on tag name
export function getTagTextClass(tagName: string): string {
  const color = getTagColor(tagName);
  
  // Return the original color for text
  return `text-[${color}]`;
}
