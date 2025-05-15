
// Экспорты компонентов заметок
export { default as NoteContent } from './editor/NoteContent';
export { default as NoteMetadata } from './editor/NoteMetadata';
export { default as NoteEditorActions } from './editor/NoteEditorActions';
export { default as NotesContent } from './content/NotesContent';

// Реэкспорт существующих компонентов для обратной совместимости
export * from '@/components/notes/BacklinksList';
export * from '@/components/notes/ColorPicker';
export * from '@/components/notes/NoteCard';
export * from '@/components/notes/NoteEditor';
export * from '@/components/notes/TipTapEditor';
