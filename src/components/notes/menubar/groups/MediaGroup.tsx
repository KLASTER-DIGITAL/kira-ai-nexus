
import React from "react";
import { Editor } from "@tiptap/react";
import { Image } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface MediaGroupProps {
  editor: Editor;
}

export const MediaGroup: React.FC<MediaGroupProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // The image insert functionality needs a more complete implementation
  // This is a basic placeholder for extensibility
  const handleImageInsert = () => {
    const url = prompt('Введите URL изображения:');
    
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex gap-1">
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={handleImageInsert}
        title="Вставить изображение"
      >
        <Image className="h-4 w-4" />
      </Toggle>
    </div>
  );
};
