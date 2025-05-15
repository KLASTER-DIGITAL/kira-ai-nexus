
import React from "react";
import { Editor } from "@tiptap/react";
import { MenuButton } from "../utils";
import { Image } from "lucide-react";

export const MediaGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  const addImage = () => {
    const url = window.prompt('URL изображения');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <MenuButton
      editor={editor}
      onClick={addImage}
      title="Добавить изображение"
    >
      <Image className="h-4 w-4" />
    </MenuButton>
  );
};
