
import React from "react";
import { Editor } from "@tiptap/react";
import { MenuButton } from "../utils";
import { Heading1, Heading2, Heading3, Quote, Code } from "lucide-react";

export const HeadingsGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MenuButton
        editor={editor}
        isActive={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Заголовок 1"
      >
        <Heading1 className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Заголовок 2"
      >
        <Heading2 className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Заголовок 3"
      >
        <Heading3 className="h-4 w-4" />
      </MenuButton>
      
      <MenuButton
        editor={editor}
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Цитата"
      >
        <Quote className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Блок кода"
      >
        <Code className="h-4 w-4" />
      </MenuButton>
    </>
  );
};
