
import React from "react";
import { MenuBarProps } from "./types";
import { MenuDivider } from "./utils";
import { 
  TextFormattingGroup, 
  LinkGroup, 
  ListGroup, 
  HeadingsGroup, 
  MediaGroup, 
  HistoryGroup 
} from "./groups";

const MenuBar: React.FC<MenuBarProps> = ({ editor, noteId, onColorSelect }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b flex flex-wrap gap-1 p-2 bg-muted/20">
      <TextFormattingGroup editor={editor} />
      
      <MenuDivider />
      
      <LinkGroup editor={editor} noteId={noteId} />
      
      <MenuDivider />
      
      <ListGroup editor={editor} />
      
      <MenuDivider />
      
      <HeadingsGroup editor={editor} />
      
      <MediaGroup editor={editor} />
      
      <MenuDivider />
      
      <HistoryGroup editor={editor} />
    </div>
  );
};

export default MenuBar;
