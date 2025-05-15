
import { Editor } from "@tiptap/react";

export interface MenuBarProps {
  editor: Editor | null;
  noteId?: string;
}

export interface MenuButtonProps {
  editor: Editor;
  isActive?: boolean;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface MenuDividerProps {
  className?: string;
}
