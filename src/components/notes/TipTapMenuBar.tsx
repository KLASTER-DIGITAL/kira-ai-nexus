
import React from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  ListOrdered,
  ListUnordered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Image,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuBarProps {
  editor: Editor;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  const addImage = () => {
    const url = window.prompt('URL изображения');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border-b flex flex-wrap gap-1 p-2 bg-muted/20">
      <Button
        size="sm"
        variant="ghost"
        className={editor.isActive("bold") ? "bg-muted" : ""}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Жирный (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={editor.isActive("italic") ? "bg-muted" : ""}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Курсив (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={editor.isActive("underline") ? "bg-muted" : ""}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Подчеркнутый (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={editor.isActive("strike") ? "bg-muted" : ""}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Зачеркнутый"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <span className="h-6 w-px bg-muted mx-1"></span>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={addLink}
        className={editor.isActive("link") ? "bg-muted" : ""}
        title="Ссылка"
      >
        <Link className="h-4 w-4" />
      </Button>
      
      <span className="h-6 w-px bg-muted mx-1"></span>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-muted" : ""}
        title="Маркированный список"
      >
        <ListUnordered className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-muted" : ""}
        title="Нумерованный список"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <span className="h-6 w-px bg-muted mx-1"></span>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
        title="Заголовок 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        title="Заголовок 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
        title="Заголовок 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-muted" : ""}
        title="Цитата"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "bg-muted" : ""}
        title="Блок кода"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={addImage}
        title="Добавить изображение"
      >
        <Image className="h-4 w-4" />
      </Button>
      
      <span className="h-6 w-px bg-muted mx-1"></span>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Отменить"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Повторить"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};
