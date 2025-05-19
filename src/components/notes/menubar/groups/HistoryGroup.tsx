
import React from "react";
import { Editor } from "@tiptap/react";
import { Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryGroupProps {
  editor: Editor;
}

export const HistoryGroup: React.FC<HistoryGroupProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-1 ml-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8"
        title="Отменить"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8"
        title="Повторить"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};
