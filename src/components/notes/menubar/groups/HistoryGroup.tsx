
import React from "react";
import { Editor } from "@tiptap/react";
import { MenuButton } from "../utils";
import { Undo, Redo } from "lucide-react";

export const HistoryGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MenuButton
        editor={editor}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Отменить"
      >
        <Undo className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Повторить"
      >
        <Redo className="h-4 w-4" />
      </MenuButton>
    </>
  );
};
