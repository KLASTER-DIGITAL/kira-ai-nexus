
import React from "react";
import { Editor } from "@tiptap/react";
import { MenuButton } from "../utils";
import { List, ListOrdered } from "lucide-react";

export const ListGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MenuButton
        editor={editor}
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Маркированный список"
      >
        <List className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Нумерованный список"
      >
        <ListOrdered className="h-4 w-4" />
      </MenuButton>
    </>
  );
};
