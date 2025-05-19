
import React from "react";
import { Editor } from "@tiptap/react";
import { ListOrdered, List } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface ListGroupProps {
  editor: Editor;
}

export const ListGroup: React.FC<ListGroupProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        title="Маркированный список"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        title="Нумерованный список"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
};
