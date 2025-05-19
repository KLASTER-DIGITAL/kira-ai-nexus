
import React from "react";
import { Editor } from "@tiptap/react";
import { MenuBar } from "./index";

interface EnhancedMenuBarProps {
  editor: Editor;
  noteId?: string;
  onColorSelect?: (color: string) => void;
}

const EnhancedMenuBar: React.FC<EnhancedMenuBarProps> = ({ 
  editor, 
  noteId,
  onColorSelect
}) => {
  return (
    <MenuBar editor={editor} noteId={noteId} onColorSelect={onColorSelect} />
  );
};

export default EnhancedMenuBar;
