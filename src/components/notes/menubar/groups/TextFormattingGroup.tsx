
import React from "react";
import { Editor } from "@tiptap/react";
import { MenuButton } from "../utils";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";

export const TextFormattingGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MenuButton
        editor={editor}
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Жирный (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Курсив (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Подчеркнутый (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Зачеркнутый"
      >
        <Strikethrough className="h-4 w-4" />
      </MenuButton>
    </>
  );
};
