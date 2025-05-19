
import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { Link } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinkGroupProps {
  editor: Editor;
  noteId?: string;
}

export const LinkGroup: React.FC<LinkGroupProps> = ({ editor, noteId }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) {
    return null;
  }

  const handleSetLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().unsetLink().run();
      setIsLinkModalOpen(false);
      return;
    }

    // Update link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();

    setIsLinkModalOpen(false);
    setLinkUrl("");
  };

  return (
    <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
      <DialogTrigger asChild>
        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          onPressedChange={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setLinkUrl(editor.getAttributes("link").href || "");
              setIsLinkModalOpen(true);
            }
          }}
          title="Ссылка"
        >
          <Link className="h-4 w-4" />
        </Toggle>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Вставить ссылку</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Input
              id="link"
              placeholder="Введите URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSetLink();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsLinkModalOpen(false)}>
            Отмена
          </Button>
          <Button type="button" onClick={handleSetLink}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
