
import React from "react";
import { Editor } from "@tiptap/react";
import { Heading } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeadingsGroupProps {
  editor: Editor;
}

export const HeadingsGroup: React.FC<HeadingsGroupProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Toggle
          size="sm"
          pressed={
            editor.isActive("heading", { level: 1 }) ||
            editor.isActive("heading", { level: 2 }) ||
            editor.isActive("heading", { level: 3 })
          }
          title="Заголовки"
        >
          <Heading className="h-4 w-4" />
        </Toggle>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          className="text-xl"
          onSelect={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          Заголовок 1
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-lg"
          onSelect={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          Заголовок 2
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base"
          onSelect={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          Заголовок 3
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => editor.chain().focus().setParagraph().run()}
        >
          Обычный текст
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
