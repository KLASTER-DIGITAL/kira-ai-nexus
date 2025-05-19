
import { Editor } from "@tiptap/react";

export interface MenuBarProps {
  editor: Editor;
  noteId?: string;
  onColorSelect?: (color: string) => void;
}
